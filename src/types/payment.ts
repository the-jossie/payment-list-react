export const PAYMENT_STATUSES = ["completed", "pending", "failed", "refunded"] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const isPaymentStatus = (value: string): value is PaymentStatus =>
  (PAYMENT_STATUSES as readonly string[]).includes(value);

export interface Payment {
  id: string;
  customerName?: string | null;
  amount: number;
  currency?: string | null;
  status: PaymentStatus;
  date: string;
  customerAddress?: string | null;
  description?: string | null;
  clientId?: string | null;
}

export interface PaymentSearchResponse {
  payments: Payment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaymentFilters {
  search: string;
  currency: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export type PaymentSearchParams = PaginationParams & Partial<PaymentFilters>;
