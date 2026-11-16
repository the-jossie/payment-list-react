import { describe, expect, test } from "vitest";
import { ApiError, toApiError } from "./ApiError";

describe("ApiError", () => {
  test("keeps the underlying error as cause", () => {
    const original = new Error("socket hang up");
    const error = new ApiError("unknown", { cause: original });

    expect(error.cause).toBe(original);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
  });
});

describe("toApiError", () => {
  test("returns an existing ApiError unchanged", () => {
    const original = new ApiError("not-found");
    expect(toApiError(original)).toBe(original);
  });

  test.each([new TypeError("boom"), "a string", undefined])(
    "wraps %j as unknown and keeps it as cause",
    (thrown) => {
      const error = toApiError(thrown);

      expect(error).toBeInstanceOf(ApiError);
      expect(error.type).toBe("unknown");
      expect(error.cause).toBe(thrown);
    }
  );
});
