import { describe, expect, test } from "vitest";
import { ApiError } from "./ApiError";
import { httpClient } from "./httpClient";

describe("httpClient", () => {
  test("maps a non-HTTP failure to an unknown ApiError", async () => {
    const error = await httpClient
      .get("/anything", { adapter: () => Promise.reject(new TypeError("boom")) })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ type: "unknown", cause: expect.any(TypeError) });
  });
});
