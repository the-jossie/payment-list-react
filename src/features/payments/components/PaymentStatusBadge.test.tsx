import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

const GREEN = "#d1fae5";
const AMBER = "#fef3c7";
const RED = "#fee2e2";
const GREY = "#e5e7eb";

describe("PaymentStatusBadge", () => {
  test.each([
    ["completed", GREEN],
    ["pending", AMBER],
    ["failed", RED],
    ["refunded", RED],
  ])("renders %s with its colour", (status, background) => {
    render(<PaymentStatusBadge status={status} />);
    expect(screen.getByText(status)).toHaveStyle({ backgroundColor: background });
  });

  test("renders an unknown status as-is in neutral grey", () => {
    render(<PaymentStatusBadge status="disputed" />);
    expect(screen.getByText("disputed")).toHaveStyle({ backgroundColor: GREY });
  });
});
