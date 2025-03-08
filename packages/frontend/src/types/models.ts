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

// Définition des interfaces pour les items d'une vente
export interface SaleItemInput {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number | string;
}

// Interface pour la création d'une vente
export interface SaleCreateInput {
  date: string;
  buyerName: string;
  buyerAddress: string;
  items: SaleItemInput[];
  price: number | string;
  status?: string;
}

// Interface pour la mise à jour d'une vente
export interface SaleUpdateInput {
  date?: string;
  buyerName?: string;
  buyerAddress?: string;
  items?: SaleItemInput[];
  price?: number | string;
  status?: string;
}

// Modification de l'interface Sale existante pour inclure les items
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