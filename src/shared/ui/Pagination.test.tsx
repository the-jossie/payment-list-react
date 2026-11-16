import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { I18N } from "../../constants/i18n";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  test("requests the previous and next pages", () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} pageSize={5} total={20} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: I18N.PREVIOUS_BUTTON }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);

    fireEvent.click(screen.getByRole("button", { name: I18N.NEXT_BUTTON }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });
});
