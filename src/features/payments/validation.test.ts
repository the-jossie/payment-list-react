import { describe, expect, expectTypeOf, test } from "vitest";
import { Currency } from "./types";
import { I18N } from "../../constants/i18n";
import {
  isCurrency,
  normalizeSearch,
  SEARCH_MAX_LENGTH,
  validateSearch,
} from "./validation";

describe("normalizeSearch", () => {
  test.each([
    ["  pay_134  ", "pay_134"],
    ["José   O'Neil", "José O'Neil"],
    ["Anne-Marie\tSmith", "Anne-Marie Smith"],
    ["line\nbreak", "line break"],
    ["null\u0000byte", "null byte"],
    ["", ""],
  ])("%j → %j", (input, expected) => {
    expect(normalizeSearch(input)).toBe(expected);
  });
});

describe("validateSearch", () => {
  test.each([
    "",
    "pay_134_1",
    "401",
    "José O'Neil",
    "Anne-Marie Smith",
    "completed",
    "李小龍",
    "a".repeat(SEARCH_MAX_LENGTH),
    `  ${"a".repeat(SEARCH_MAX_LENGTH)}  `,
  ])("accepts %j", (value) => {
    expect(validateSearch(value)).toBeNull();
  });

  test("rejects input over the length limit", () => {
    expect(validateSearch("a".repeat(SEARCH_MAX_LENGTH + 1))).toBe(I18N.SEARCH_TOO_LONG);
  });

  test("counts characters, not UTF-16 units", () => {
    expect(validateSearch("😀".repeat(SEARCH_MAX_LENGTH))).toBeNull();
  });
});

describe("isCurrency", () => {
  test.each([
    ["USD", true],
    ["EUR", true],
    ["usd", false],
    ["XYZ", false],
    ["", false],
  ])("%j → %s", (value, expected) => {
    expect(isCurrency(value)).toBe(expected);
  });
});

describe("isCurrency as a type guard", () => {
  test("narrows a string to Currency", () => {
    const value: string = "GBP";
    if (isCurrency(value)) {
      expectTypeOf(value).toEqualTypeOf<Currency>();
    }
    expect(isCurrency(value)).toBe(true);
  });
});
