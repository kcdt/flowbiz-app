import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { invoices } from "../schemas";

export type Invoice = InferSelectModel<typeof invoices>;

export type NewInvoice = InferInsertModel<typeof invoices>;

export type InvoiceColumns = { [K in keyof Invoice]?: boolean };