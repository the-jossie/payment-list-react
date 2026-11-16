# Payment List

This contains how to run the app, how it's structured, and the decisions and trade-offs made. The original challenge instruction is unchanged, and moved to [💳 Payment Search Challenge](#-payment-search-challenge).

## Setup

```bash
npm install
npm run dev             # at http://localhost:3000
npm test                # all tests
npm run test:coverage   # tests + coverage report
npm run build           # type-check + production build
```

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

**React Query for server state.**

- _Why:_ caching, loading and error flags, and `keepPreviousData`, so the table doesn't flash empty when changing pages or filters.
- _Trade-off:_ one more library. Retries are off because the provided tests require it. In production, allow retries for network and 5xx errors, but not for 404s.

**One generic `DataTable`.** It takes column definitions (`key`, header, `render`) and is typed over the row. Loading, empty state and pagination are props, so any future table gets them for free.

**Styling.** Kept the provided styled-components and split them into `layout`, `form`, `table` and `feedback` files instead of one 250-line file.
