export interface Category {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface CategoryCreateInput {
  name: string;
  description?: string;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  quantity: number;
  imageUrl?: string;
  categoryId?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface ProductCreateInput {
  name: string;
  description?: string;
  price: number | string;
  quantity: number;
  imageUrl?: string;
  categoryId?: string;
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number | string;
  quantity?: number;
  imageUrl?: string;
  categoryId?: string;
}