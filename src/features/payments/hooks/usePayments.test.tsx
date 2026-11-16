import { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ApiError } from "../../../shared/api/ApiError";
import { createQueryClient } from "../../../shared/lib/queryClient";
import { fetchPayments } from "../api/fetchPayments";
import { usePayments } from "./usePayments";

vi.mock("../api/fetchPayments", () => ({ fetchPayments: vi.fn() }));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

const renderUsePayments = () =>
  renderHook(() => usePayments({ page: 1, pageSize: 5 }), { wrapper });

afterEach(() => vi.mocked(fetchPayments).mockReset());

describe("usePayments errors", () => {
  test("passes an ApiError through unchanged", async () => {
    const apiError = new ApiError("not-found");
    vi.mocked(fetchPayments).mockRejectedValue(apiError);

    const { result } = renderUsePayments();

    await waitFor(() => expect(result.current.error).toBe(apiError));
  });

  test("turns anything else into an unknown ApiError, keeping the original", async () => {
    const thrown = new TypeError("Cannot read properties of undefined");
    vi.mocked(fetchPayments).mockRejectedValue(thrown);

    const { result } = renderUsePayments();

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error?.type).toBe("unknown");
    expect(result.current.error?.cause).toBe(thrown);
  });
});
