import { describe, expect, test } from "vitest";
import { formatAmount, formatDate } from "./format";

describe("formatAmount", () => {
  test.each([
    [250, "250.00"],
    [150.5, "150.50"],
    [120.75, "120.75"],
    [0, "0.00"],
    [1234.567, "1234.57"],
  ])("formats %s as %s", (amount, expected) => {
    expect(formatAmount(amount)).toBe(expected);
  });
});

describe("formatDate", () => {
  test("formats as dd/MM/yyyy, HH:mm:ss", () => {
    const date = new Date(2024, 3, 15, 11, 0, 0).toISOString();
    expect(formatDate(date)).toBe("15/04/2024, 11:00:00");
  });

  test("zero-pads single-digit parts", () => {
    const date = new Date(2024, 0, 5, 9, 7, 3).toISOString();
    expect(formatDate(date)).toBe("05/01/2024, 09:07:03");
  });

  test("uses a 24-hour clock", () => {
    const date = new Date(2024, 11, 31, 23, 59, 59).toISOString();
    expect(formatDate(date)).toBe("31/12/2024, 23:59:59");
  });
});

describe("formatDate with invalid input", () => {
  test("returns the original value instead of throwing", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});
