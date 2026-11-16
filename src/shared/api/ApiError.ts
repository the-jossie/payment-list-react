export type ApiErrorType = "not-found" | "server" | "unknown";

export class ApiError extends Error {
  constructor(
    readonly type: ApiErrorType,
    options?: { cause?: unknown }
  ) {
    super(`API request failed: ${type}`, options);
    this.name = "ApiError";
  }
}

export const toApiError = (error: unknown): ApiError =>
  error instanceof ApiError ? error : new ApiError("unknown", { cause: error });
