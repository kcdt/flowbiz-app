import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Essentiel pour les cookies
});

let authStorePromise: Promise<any> | null = null;
let routerPromise: Promise<any> | null = null;

const getAuthStore = async () => {
  if (!authStorePromise) {
    authStorePromise = import('@/stores/auth.store').then(module => {
      const useAuthStore = module.useAuthStore;
      return useAuthStore();
    });
  }
  return await authStorePromise;
};

const getRouter = async () => {
  if (!routerPromise) {
    routerPromise = import('@/router').then(module => module.default);
  }
  return await routerPromise;
};

apiClient.interceptors.request.use(
  async (config) => {
    const store = await getAuthStore();
    if (store.accessToken) {
      config.headers.Authorization = `Bearer ${store.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {    
    const originalRequest = error.config;
    
    const isAuthRequest = originalRequest.url && (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/logout') ||
      originalRequest.url.includes('/auth/refresh-token')
    );
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const store = await getAuthStore();
        
        const response = await store.refreshToken();
        
        if (response?.data?.data?.accessToken) {
          const newToken = response.data.data.accessToken;
          onTokenRefreshed(newToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('Échec du rafraîchissement du token: mauvaise structure de réponse');
        }
      } catch (refreshError) {
        const store = await getAuthStore();
        const router = await getRouter();
        const currentRoute = router.currentRoute.value;
        
        await store.logout();
        
        if (currentRoute.name !== 'login') {
          await router.push({ 
            name: 'login',
            query: { 
              redirect: currentRoute.fullPath,
              session_expired: 'true'
            }
          });
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;