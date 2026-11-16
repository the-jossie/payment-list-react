import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ApiError, toApiError } from "../../../shared/api/ApiError";
import { fetchPayments } from "../api/fetchPayments";
import { PaymentSearchParams, PaymentSearchResponse } from "../types";

export const paymentsKeys = {
  all: ["payments"] as const,
  list: (params: PaymentSearchParams) => [...paymentsKeys.all, "list", params] as const,
};

export const usePayments = (params: PaymentSearchParams) =>
  useQuery<PaymentSearchResponse, ApiError>({
    queryKey: paymentsKeys.list(params),
    queryFn: () =>
      fetchPayments(params).catch((error: unknown) => {
        throw toApiError(error);
      }),
    placeholderData: keepPreviousData,
  });
