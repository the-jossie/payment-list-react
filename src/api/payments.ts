import axios, { HttpStatusCode, isAxiosError } from "axios";
import { API_URL } from "../constants";
import { ApiError, ApiErrorType } from "../types/error";
import { PaymentSearchParams, PaymentSearchResponse } from "../types/payment";

const getErrorType = (error: unknown): ApiErrorType => {
  const status = isAxiosError(error) ? error.response?.status : undefined;

  if (status === HttpStatusCode.NotFound) return "not-found";
  if (status === HttpStatusCode.InternalServerError) return "server";
  return "unknown";
};

export const fetchPayments = async (
  params: PaymentSearchParams
): Promise<PaymentSearchResponse> => {
  try {
    const { data } = await axios.get<PaymentSearchResponse>(API_URL, { params });
    return data;
  } catch (error) {
    throw new ApiError(getErrorType(error));
  }
};
