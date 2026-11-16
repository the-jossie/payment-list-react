import { describe, expect, expectTypeOf, test } from "vitest";
import { PAYMENT_STATUSES } from "./constants";
import { isPaymentStatus, PaymentStatus } from "./types";

describe("isPaymentStatus", () => {
  test.each(PAYMENT_STATUSES)("recognises %s", (status) => {
    expect(isPaymentStatus(status)).toBe(true);
  });

  test.each(["disputed", "Completed", "", " pending"])("rejects %j", (value) => {
    expect(isPaymentStatus(value)).toBe(false);
  });

  test("narrows a string to PaymentStatus", () => {
    const value: string = "pending";
    if (isPaymentStatus(value)) {
      expectTypeOf(value).toEqualTypeOf<PaymentStatus>();
    }
  });
});
