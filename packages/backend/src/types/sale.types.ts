import { updateSaleItems } from "../services/sale.item.service";

export interface SaleInput {
  price: number;
  status?: string;
  buyerName: string;
  buyerAddress: string;
  companyId: string;
  date?: Date;
}

export interface CreateSaleInput {
  buyerName: string;
  buyerAddress: string;
  date: string;
  items: SaleItemInput[];
  price: string;
}

export interface SaleItemInput {
  id: string;
  quantity: number;
  unitPrice: number;
  productId: string;
}

export interface SaleFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  companyId?: string;
}

export interface CompletedSale {
  price: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  buyerName: string;
  buyerAddress: string;
  companyId: string;
  date: string;
  id: string;
  createdAt: Date;
  updatedAt: Date
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  imageUrl: string | null;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  quantity: number;
  unitPrice: string;
  saleId: string;
  productId: string;
  product: Product;
}

export interface updateSaleItemsInput { 
  productId: string; 
  quantity: number; 
  unitPrice?: string | number 
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  date: string;
  price: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  buyerName: string;
  buyerAddress: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  items: SaleItem[];
  company: Company;
}

export interface UpdateSaleInput {
  buyerName?: string;
  buyerAddress?: string;
  status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
  date?: string | Date;
  items?: {
    productId: string;
    quantity: number;
    unitPrice?: number;
  }[];
  price?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issuedDate: Date;
  totalAmount: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';
  companyId: string;
  saleId: string;
  createdAt: Date;
  updatedAt: Date;
  sale: Sale;
}

export type InvoiceWithDetails = Invoice;
