# Truestate Sales Management

This repo contains a Go/Gin backend and a Next.js (App Router) frontend for exploring sales transactions with rich filtering, sorting, and summary insights.

## Architecture (high level)

- Frontend (Next.js/React/TypeScript) renders the UI, calls backend REST APIs, and handles client-side state for filters, sorting, and pagination.
- Backend (Go, Gin, GORM) exposes REST endpoints, applies filters, sorting, pagination, and returns typed responses. Data is loaded from a CSV into MySQL on startup if empty.
- Database (MySQL) stores the `transactions` table with embedded customer, product, sales, and logistics fields.

```
[Browser]
   |
   | HTTPS (REST)
   v
[Next.js Frontend] -- axios --> [Go Gin API] -- GORM --> [MySQL]
```

## Key tech stack

- Frontend: Next.js 14 (App Router), React, TypeScript, axios, Tailwind CSS utility classes.
- Backend: Go 1.22, Gin, GORM, MySQL driver, godotenv.
- Tooling: npm for frontend, Go modules for backend.

## API overview

- `GET /api/sales` — paginated, filterable transactions.
- `GET /api/sales/summary` — aggregate totals (units, amount, discount, count).
- `GET /api/filters/options` — distinct filter option lists.

Filter/query params (snake_case as sent by frontend):

- Search: `search`
- Pagination: `page`, `pageSize`
- Sorting: `sortField` (`date|quantity|customer_name`), `sortDirection` (`asc|desc`)
- Filters (arrays unless noted): `region`, `gender`, `category`, `tag`, `payment_method`, `min_age`, `max_age`, `start_date`, `end_date`

## Environment

- Backend: `PORT` (default 8080), `DB_DSN` (MySQL DSN).
- Frontend: `NEXT_PUBLIC_API_URL` (default `http://localhost:8080`).

## Local development

Backend:
```bash
cd backend
go mod tidy
go run main.go
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Data flow (request/response)

1) User sets filters/search/sort/pagination in the UI.  
2) Frontend builds query params (snake_case) and calls backend.  
3) Backend applies filters via GORM, paginates, and returns camelCase payloads that match `src/types`.  
4) UI renders table, summary cards, pagination.  

See `backend/README.md` and `frontend/README.md` for subsystem details.

