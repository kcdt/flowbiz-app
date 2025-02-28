export interface SaleInput {
  price: number;
  status?: string;
  buyerName: string;
  buyerAddress: string;
  companyId?: string;
  date?: Date;
}

export interface SaleItemInput {
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
  companyId?: string;
  date?: Date;
  id: string,
  createdAt: Date,
  updatedAt: Date
}