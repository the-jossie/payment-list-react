import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { http, HttpResponse, JsonBodyType } from "msw";
import { server } from "../../../mocks/node";
import { ApiError } from "../../../shared/api/ApiError";
import { PAYMENTS_API_URL } from "../constants";
import { fetchPayments } from "./fetchPayments";

const BASE_PARAMS = { page: 1, pageSize: 5 };

const respondWithJson = (body: JsonBodyType, status = 200) =>
  server.use(http.get(`*${PAYMENTS_API_URL}`, () => HttpResponse.json(body, { status })));

const captureSearchParams = () => {
  const captured: URLSearchParams[] = [];
  server.events.on("request:start", ({ request }) => {
    captured.push(new URL(request.url).searchParams);
  });
  return captured;
};

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  server.events.removeAllListeners();
});
afterAll(() => server.close());

describe("fetchPayments", () => {
  test("returns the parsed response", async () => {
    const response = await fetchPayments(BASE_PARAMS);

    expect(response.payments).toHaveLength(5);
    expect(response).toMatchObject({ page: 1, pageSize: 5 });
    expect(response.total).toBeGreaterThan(5);
  });

  test("sends pagination and filters as query params", async () => {
    const captured = captureSearchParams();
    await fetchPayments({ ...BASE_PARAMS, search: "pay_134", currency: "USD" });

    expect(Object.fromEntries(captured[0])).toEqual({
      page: "1",
      pageSize: "5",
      search: "pay_134",
      currency: "USD",
    });
  });

  test("rejects HTTP errors as ApiError", async () => {
    respondWithJson({}, 404);

    const error = await fetchPayments(BASE_PARAMS).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ type: "not-found" });
  });
});
