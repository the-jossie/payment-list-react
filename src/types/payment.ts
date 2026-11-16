export type PaymentStatus = "completed" | "pending" | "failed" | "refunded" | string;

export interface Payment {
  id: string;
  customerName?: string | null;
  amount: number;
  currency?: string | null;
  status: PaymentStatus;
  date: string;
}

export interface PaymentSearchResponse {
  payments: Payment[];
  page: number;
  pageSize: number;
}

export interface PaymentSearchParams {
  page: number;
  pageSize: number;
  search?: string;
}
