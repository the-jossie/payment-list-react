import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPayments } from "../api/payments";
import { PaymentSearchParams } from "../types/payment";

export const usePayments = (params: PaymentSearchParams) =>
  useQuery({
    queryKey: ["payments", params],
    queryFn: () => fetchPayments(params),
    placeholderData: keepPreviousData,
  });
