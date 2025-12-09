# Frontend (Next.js / React / TS)

## Overview
- Next.js App Router UI for browsing sales transactions with search, filters, sorting, and pagination.
- Uses axios to call the Go backend REST API.
- Types in `src/types` mirror backend responses (camelCase).

## Architecture

```
Components (SearchBar, FilterPanel, SortDropdown, SummaryCards, DataTable, Pagination)
        |
    useSalesData hook (builds query params, calls API, manages loading/error/state)
        |
    salesApi (axios client) --> backend REST
```

- `app/page.tsx` composes UI and wires handlers.
- `hooks/useSalesData.ts` orchestrates data fetching and state.
- `services/service.ts` (alias `@/services/api`) builds query strings and calls `/api/sales`, `/api/sales/summary`, `/api/filters/options`.
- `components/*` render the UI; `utils/constants.ts` holds sort options, page size, age ranges.

## Environment
- `NEXT_PUBLIC_API_URL` (default `http://localhost:8080`) — base URL for backend.

## Running locally
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000.

## Data contract (frontend <-> backend)
- Query params (snake_case) sent by frontend: `search`, `page`, `pageSize`, `sortField`, `sortDirection`, `region[]`, `gender[]`, `category[]`, `tag[]`, `payment_method[]`, `min_age`, `max_age`, `start_date`, `end_date`.
- Responses use camelCase matching `src/types`:
  - `SalesResponse`: `transactions`, `total`, `page`, `pageSize`, `totalPages`
  - `SalesTransaction` fields include `transactionId`, `customerName`, `productCategory`, `pricePerUnit`, etc.
  - `SummaryStats`: `totalUnitsSold`, `totalAmount`, `totalDiscount`, `totalTransactions`.
