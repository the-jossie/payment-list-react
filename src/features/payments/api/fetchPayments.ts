import { httpClient } from "../../../shared/api/httpClient";
import { PAYMENTS_API_URL } from "../constants";
import { PaymentSearchParams, PaymentSearchResponse } from "../types";

export const fetchPayments = async (
  params: PaymentSearchParams
): Promise<PaymentSearchResponse> => {
  const { data } = await httpClient.get<PaymentSearchResponse>(PAYMENTS_API_URL, {
    params,
  });
  return data;
};
