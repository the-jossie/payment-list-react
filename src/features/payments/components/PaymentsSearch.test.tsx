import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { I18N } from "../../../constants/i18n";
import { PaymentsSearch } from "./PaymentsSearch";

const renderSearch = (searchQuery: string, isClearable = false) => {
  const props = {
    searchQuery,
    onSearchQueryChange: vi.fn(),
    filters: { search: "", currency: "" },
    onFiltersChange: vi.fn(),
    isClearable,
    onClear: vi.fn(),
  };
  render(<PaymentsSearch {...props} />);
  return props;
};

const submit = () => fireEvent.click(screen.getByRole("button", { name: I18N.SEARCH_BUTTON }));

describe("PaymentsSearch validation", () => {
  test("applies a valid, trimmed search", () => {
    const props = renderSearch("  pay_134  ");
    submit();

    expect(props.onFiltersChange).toHaveBeenCalledWith({ search: "pay_134" });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("applies a customer name with spaces, apostrophes and accents", () => {
    const props = renderSearch("  José   O'Neil ");
    submit();

    expect(props.onFiltersChange).toHaveBeenCalledWith({ search: "José O'Neil" });
  });

  test("blocks an invalid search and explains why", () => {
    const props = renderSearch("a".repeat(101));
    submit();

    expect(props.onFiltersChange).not.toHaveBeenCalled();
    const input = screen.getByRole("searchbox");
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(I18N.SEARCH_TOO_LONG);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", alert.id);
  });

  test("clears the error as soon as the user edits the input", () => {
    const props = renderSearch("a".repeat(101));
    submit();

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "pay134" } });

    expect(props.onSearchQueryChange).toHaveBeenCalledWith("pay134");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("searchbox")).not.toHaveAttribute("aria-invalid");
  });

  test("clears the error on Clear Filters", () => {
    const props = renderSearch("a".repeat(101), true);
    submit();

    fireEvent.click(screen.getByRole("button", { name: I18N.CLEAR_FILTERS }));

    expect(props.onClear).toHaveBeenCalled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("accepts a listed currency", () => {
    const props = renderSearch("");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "EUR" } });

    expect(props.onFiltersChange).toHaveBeenCalledWith({ currency: "EUR" });
  });

  test("falls back to no currency for a value outside the list", () => {
    const props = renderSearch("");
    const select = screen.getByRole("combobox");
    const injected = document.createElement("option");
    injected.value = "XYZ";
    select.appendChild(injected);

    fireEvent.change(select, { target: { value: "XYZ" } });

    expect(props.onFiltersChange).toHaveBeenCalledWith({ currency: "" });
  });
});
