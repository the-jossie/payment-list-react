import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { I18N } from "../../../constants/i18n";
import { PaymentsTable } from "./PaymentsTable";

describe("PaymentsTable", () => {
  test("shows fallbacks when customer and currency are missing", () => {
    render(
      <PaymentsTable
        payments={[
          {
            id: "pay_1",
            customerName: null,
            amount: 1,
            currency: null,
            status: "completed",
            date: "2024-04-15T10:00:00Z",
          },
        ]}
      />
    );

    const cells = within(screen.getAllByRole("row")[1]).getAllByRole("cell");
    expect(cells[3]).toHaveTextContent(I18N.EMPTY_CUSTOMER);
    expect(cells[4]).toHaveTextContent(I18N.EMPTY_CURRENCY);
  });
});
