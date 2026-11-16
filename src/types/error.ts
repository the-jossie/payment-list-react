export type ApiErrorType = "not-found" | "server" | "unknown";

export class ApiError extends Error {
  constructor(readonly type: ApiErrorType) {
    super(`API request failed: ${type}`);
    this.name = "ApiError";
  }
}
