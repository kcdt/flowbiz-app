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
  categoryId: string | null;
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
  categoryId: string | null;
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number | string;
  quantity?: number;
  imageUrl?: string;
  categoryId: string | null;
}

export interface detailedSale {
  id: string;
  date: string;
  price: string;
  status: string;
  buyerName: string;
  buyerAddress: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    quantity: number;
    unitPrice: string;
    productId: string;
    productName: string;
    productDescription: string;
  }[];
}

export interface SaleItemInput {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number | string;
}

export interface SaleCreateInput {
  date: string;
  buyerName: string;
  buyerAddress: string;
  items: SaleItemInput[];
  price: number | string;
  status?: string;
}

export interface SaleUpdateInput {
  date?: string;
  buyerName?: string;
  buyerAddress?: string;
  items?: SaleItemInput[];
  price?: number | string;
  status?: string;
}

export interface Sale {
  id: string;
  date: string;
  price: string;
  status: string;
  buyerName: string;
  buyerAddress: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    quantity: number;
    unitPrice: string;
    productId: string;
    productName: string;
    productDescription: string;
  }[];
}

export type SaleStatus = 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';


export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateInput {
  name: string;
  email: string;
  phone: string;
}
