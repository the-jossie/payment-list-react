import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPayments } from "../api/payments";
import { ApiError } from "../types/error";
import { PaymentSearchParams, PaymentSearchResponse } from "../types/payment";

export const usePayments = (params: PaymentSearchParams) =>
  useQuery<PaymentSearchResponse, ApiError>({
    queryKey: ["payments", params],
    queryFn: () => fetchPayments(params),
    placeholderData: keepPreviousData,
  });
