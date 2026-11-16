import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { delay, http, HttpResponse } from "msw";
import { server } from "../../../mocks/node";
import { PAYMENTS_API_URL as API_URL } from "../constants";
import { I18N } from "../../../constants/i18n";
import { Payment } from "../types";
import { renderWithQueryClient } from "../../../shared/test/renderWithQueryClient";
import { PaymentsPage } from "./PaymentsPage";

const createPaymentRecords = (count: number, prefix = "pay"): Payment[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}_${i + 1}`,
    customerName: "Test Customer",
    amount: 10,
    currency: "USD",
    status: "completed",
    date: "2024-04-15T10:00:00Z",
  }));

const renderPage = () => renderWithQueryClient(<PaymentsPage />);

const waitForRows = () =>
  waitFor(() => expect(screen.getAllByRole("cell").length).toBeGreaterThan(0));

const nextButton = () => screen.getByRole("button", { name: I18N.NEXT_BUTTON });

const requestedPages: string[] = [];

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  server.events.removeAllListeners();
  requestedPages.length = 0;
});
afterAll(() => server.close());

describe("PaymentsPage errors", () => {
  test.each([
    [404, I18N.PAYMENT_NOT_FOUND],
    [500, I18N.INTERNAL_SERVER_ERROR],
    [401, I18N.SOMETHING_WENT_WRONG],
    [503, I18N.SOMETHING_WENT_WRONG],
  ])("shows the right message for a %s", async (status, message) => {
    server.use(http.get(`*${API_URL}`, () => HttpResponse.json({}, { status })));
    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  test("shows a generic message for a network failure", async () => {
    server.use(http.get(`*${API_URL}`, () => HttpResponse.error()));
    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(I18N.SOMETHING_WENT_WRONG);
  });
});

describe("PaymentsPage loading and empty states", () => {
  test("shows a spinner on first load and removes it once data arrives", async () => {
    server.use(
      http.get(`*${API_URL}`, async () => {
        await delay(50);
        return HttpResponse.json({ payments: createPaymentRecords(5), total: 5, page: 1, pageSize: 5 });
      })
    );
    renderPage();

    expect(screen.getByRole("status", { name: I18N.LOADING })).toBeInTheDocument();
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");

    await waitForRows();
    expect(screen.queryByRole("status", { name: I18N.LOADING })).not.toBeInTheDocument();
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "false");
  });

  test("shows the empty message when the API returns no payments", async () => {
    server.use(
      http.get(`*${API_URL}`, () =>
        HttpResponse.json({ payments: [], total: 0, page: 1, pageSize: 5 })
      )
    );
    renderPage();

    expect(await screen.findByText(I18N.NO_PAYMENTS_FOUND)).toBeInTheDocument();
    expect(nextButton()).toBeDisabled();
  });
});

describe("PaymentsPage pagination", () => {
  test("disables Next on the last page", async () => {
    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get("page"));
        const payments = page === 1 ? createPaymentRecords(5, "first") : createPaymentRecords(2, "last");
        return HttpResponse.json({ payments, total: 7, page, pageSize: 5 });
      })
    );
    renderPage();

    await waitForRows();
    expect(nextButton()).toBeEnabled();

    fireEvent.click(nextButton());

    expect(await screen.findByText("last_1")).toBeInTheDocument();
    expect(screen.getByText(`${I18N.PAGE_LABEL} 2`)).toBeInTheDocument();
    expect(nextButton()).toBeDisabled();
  });

  test("goes back to page 1 when a filter changes", async () => {
    server.events.on("request:start", ({ request }) => {
      requestedPages.push(new URL(request.url).searchParams.get("page") ?? "");
    });
    renderPage();

    await waitForRows();
    fireEvent.click(nextButton());
    expect(await screen.findByText(`${I18N.PAGE_LABEL} 2`)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox", { name: I18N.CURRENCY_FILTER_LABEL }), {
      target: { value: "USD" },
    });

    expect(await screen.findByText(`${I18N.PAGE_LABEL} 1`)).toBeInTheDocument();
    expect(requestedPages.at(-1)).toBe("1");

    const table = screen.getByRole("table");
    await waitFor(() => {
      const currencyCells = within(table)
        .getAllByRole("row")
        .slice(1)
        .map((row) => within(row).getAllByRole("cell")[4].textContent);
      expect(currencyCells.every((c) => c === "USD")).toBe(true);
    });
  });

  test("goes back to page 1 when a search is submitted", async () => {
    renderPage();

    await waitForRows();
    fireEvent.click(nextButton());
    expect(await screen.findByText(`${I18N.PAGE_LABEL} 2`)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(I18N.SEARCH_PLACEHOLDER), {
      target: { value: "pay_134" },
    });
    fireEvent.click(screen.getByRole("button", { name: I18N.SEARCH_BUTTON }));

    expect(await screen.findByText(`${I18N.PAGE_LABEL} 1`)).toBeInTheDocument();
  });
});

describe("PaymentsPage search", () => {
  test("finds payments by customer name, including spaces and any case", async () => {
    renderPage();
    await waitForRows();

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "  alice   GREEN " } });
    fireEvent.click(screen.getByRole("button", { name: I18N.SEARCH_BUTTON }));

    await waitFor(() => {
      const customers = screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => within(row).getAllByRole("cell")[3].textContent);
      expect(customers.length).toBeGreaterThan(0);
      expect(customers.every((name) => name === "Alice Green")).toBe(true);
    });
  });
});
