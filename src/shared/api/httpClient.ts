import axios, { HttpStatusCode, isAxiosError } from "axios";
import { ApiError, ApiErrorType } from "./ApiError";

const getErrorType = (error: unknown): ApiErrorType => {
  const status = isAxiosError(error) ? error.response?.status : undefined;

  if (status === HttpStatusCode.NotFound) return "not-found";
  if (status === HttpStatusCode.InternalServerError) return "server";
  return "unknown";
};

export const httpClient = axios.create();

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) =>
    Promise.reject(new ApiError(getErrorType(error), { cause: error }))
);
