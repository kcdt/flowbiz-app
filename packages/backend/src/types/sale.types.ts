export interface SaleInput {
  price: number;
  status?: string;
  buyerName: string;
  buyerAddress: string;
  companyId?: string;
  userId: string;
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
  userId?: string;
  companyId?: string;
}