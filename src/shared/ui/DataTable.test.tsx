import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DataTable } from "./DataTable";

describe("DataTable", () => {
  test("renders nothing below the table when empty with no message", () => {
    const { container } = render(
      <DataTable columns={[]} rows={[]} getRowKey={() => "x"} />
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(container.firstElementChild?.children).toHaveLength(1);
  });
});
