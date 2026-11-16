# Payment List

This contains how to run the app, how it's structured, and the decisions and trade-offs made. The original challenge instruction is unchanged, and moved to [💳 Payment Search Challenge](#-payment-search-challenge).

## Setup

You need Node 24 (see `.nvmrc`) and npm.

```bash
nvm use                 # switch to Node 24
npm install
npm run dev             # at http://localhost:3000
npm test                # all tests
npm run test:coverage   # tests + coverage report
npm run build           # type-check + production build
```

## Structure

```
src/
  App.tsx                   React Query provider + page shell
  constants/i18n.ts         every user-facing string
  mocks/                    MSW handlers and fixture data (dev + tests)
  features/payments/        everything specific to payments
    index.ts                public entry: only PaymentsPage is exported
    constants.ts            endpoint, page size, currencies, statuses
    types.ts                Payment, filters, request/response types
    validation.ts           search normalisation + validation, currency check
    errorMessages.ts        error type → i18n message
    api/fetchPayments.ts    the request
    hooks/usePayments.ts        React Query + query key
    hooks/usePaymentFilters.ts  search text, applied filters, page
    components/             PaymentsPage, PaymentsSearch, PaymentsTable, PaymentStatusBadge
  shared/                   reusable, knows nothing about payments
    api/                    ApiError, httpClient (axios + error mapping)
    lib/                    formatting, pagination maths, query client
    ui/                     DataTable, Pagination, styled primitives
    test/                   renderWithQueryClient
```

Data flows one way: `PaymentsPage` reads state from `usePaymentFilters`, passed from `usePayments` → `fetchPayments` → `httpClient`, and hands the result down to the table.

## Decisions and trade-offs

**Feature folder plus a shared layer.** Payments code lives in `features/payments`. Generic pieces (table, pagination, HTTP client, formatters) live in `shared/` and never import from a feature.

- _Why:_ a second feature, such as refunds, could reuse the table, client and pagination without touching payments.
- _Trade-off:_ more folders and deeper relative imports than a flat `components/` folder. Path aliases aren't added, as it isn't worth it at this size.

**State lives in one hook, and the page only puts things together.** `usePaymentFilters` owns three pieces of state and the rules between them:

- the text being typed;
- the filters actually applied (`{ search, currency }`), kept as one object;
- the current page.

Changing any filter resets to page 1, so a user never land on an empty page 3. "Clear Filters" resets everything. Adding a filter means a new field on `PaymentFilters` and a control in `PaymentsSearch`; the page and the API call don't change.

- _Trade-off:_ Kept as `useState` rather than a reducer. It's simpler to read now, but a reducer would make the rules testable without React once there are more rules.

**Search applies on submit; currency applies on change.**

- _Why:_ there's no request per keystroke, and a dropdown is one deliberate choice. The typed text and the applied search are separate, so "Clear Filters" can reset both.
- _Alternative:_ debounced search-as-you-type. It's nicer UX, but it needs a debounce, request cancellation, and different tests.

**Validate the shape of the search, not its content.**

- **The rule:** `validation.ts` turns control characters (tabs, newlines, pasted invisible characters) into spaces, collapses and trims them. The only check is a 100-character limit.
- **Why not stricter:** the API's `search` parameter matches more than payment IDs, and we'll likely add customer name or other fields.
- **Why this is safe:** axios URL-encodes the value and React escapes it when rendered.
- **How errors show:** an invalid search isn't sent. The input is marked `aria-invalid` and linked to an alert with the message.
- **Currency:** the dropdown's value is also checked against `CURRENCIES`, so only real currencies can become a filter.
- **Known gap:** the brief says search matches customer names, but the mock handler only matches ID, status and currency. A name search is accepted by the UI and then gets "Payment not found." from the mock.

**React Query for server state.**

- _Why:_ caching, loading and error flags, and `keepPreviousData`, so the table doesn't flash empty when changing pages or filters.
- _Trade-off:_ one more library. Retries are off because the provided tests require it. In production, allow retries for network and 5xx errors, but not for 404s.

**Axios is confined to one file.** `shared/api/httpClient.ts` has an interceptor that turns every failure into an `ApiError` with a `type`: `not-found` (404), `server` (500) or `unknown` (everything else, including network failures and timeouts). The payments feature maps that type to an i18n message. Nothing else imports axios, so moving to `fetch` changes one file.

**No error fails silently.** 404 and 500 have their own messages. Everything else shows "Something went wrong!" instead of an empty table.

**One generic `DataTable`.** It takes column definitions (`key`, header, `render`) and is typed over the row. Loading, empty state and pagination are props, so any future table gets them for free.

**Styling.** Kept the provided styled-components and split them into `layout`, `form`, `table` and `feedback` files instead of one 250-line file.

## Testing

Coverage is limited to `src/` and excludes `main.tsx`, the mocks and the test helpers, so config files don't skew the number.

| Layer       | What it covers                                                                                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit        | Formatters, pagination maths, search validation, the HTTP client's error mapping                                                                                 |
| Component   | `PaymentsSearch` (validation, submit, currency, clear), `PaymentsTable` (fallbacks), `PaymentStatusBadge` (each status + unknown), `DataTable`, `Pagination`     |
| Integration | `PaymentsPage` and `App` against MSW: every error code, network failure, loading, empty, last page, page reset on filter change, and the provided Step 1–8 tests |

How the tests are written:

- **They find elements the way users and screen readers do**, by role and accessible name, so they also check accessibility.
- **MSW mocks the network rather than our modules**, so the real axios client, interceptor and hooks run in every test.
- **Each page test gets a fresh query client** (`renderWithQueryClient`), so cached results can't leak between tests.

**Trade-off:** there are no browser end-to-end tests. Playwright against `npm run dev` would be the next layer, especially for the mobile layout, which jsdom can't really check.

## Accessibility

- The search form is a labelled `role="search"` landmark.
- The input and dropdown are labelled from i18n strings, and validation errors use `aria-invalid` and `aria-describedby`.
- Table headers use `scope="col"`, and the table sets `aria-busy` while loading.
- Errors use `role="alert"`, the spinner is a labelled `role="status"`, and the page number is an `aria-live` region.
- Pagination is a labelled navigation landmark with real `<button>`s.

## What can be improved

- Keep filters and page in the URL so views can be shared and survive a refresh.
- Validate API responses at runtime (e.g. with zod) so a backend change can't crash the table.
- Add an error boundary, error reporting, and retries for network and 5xx errors.
- Playwright end-to-end tests, including a mobile viewport

---
