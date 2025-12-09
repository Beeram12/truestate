# Backend (Go / Gin / GORM)

## Overview
- REST API serving sales transactions, summary stats, and filter options.
- Uses MySQL via GORM; seeds from `Project_Data.csv` on first run (skips if rows already exist).
- Environment-driven configuration with optional `.env`.

## Architecture

```
Client --> Gin Router (routes) --> Controllers --> Service (GORM) --> MySQL
```

Layers:
- `main.go` boots env, DB, auto-migrates `Transaction`, seeds CSV, and starts Gin.
- `routes/` wires middleware (CORS) and endpoints to controllers.
- `controllers/` validates/query-parses parameters, maps models to response DTOs (camelCase).
- `services/` holds DB logic (filters, sorting, pagination, aggregates, option lists).
- `models/` defines GORM models, filter params, and response types.

## API

- `GET /api/sales`
  - Query params: `search`, `page`, `pageSize`, `sortField`, `sortDirection`
  - Filters (arrays unless noted): `region`, `gender`, `category`, `tag`, `payment_method`, `min_age`, `max_age`, `start_date`, `end_date`
  - Response: paginated camelCase transactions matching frontend `SalesTransaction`.

- `GET /api/sales/summary`
  - Same filter params as above.
  - Response: `totalUnitsSold`, `totalAmount`, `totalDiscount`, `totalTransactions`.

- `GET /api/filters/options`
  - Response: distinct lists for regions, genders, categories, tags, payment methods.

## Environment
- `PORT` (default `8080`)
- `DB_DSN` MySQL DSN, e.g. `user:pass@tcp(localhost:3306)/truestate?charset=utf8mb4&parseTime=True&loc=Local`
- Optional `.env` loaded via `godotenv`.

## Deployment (Railway)

### Backend (Go + MySQL)
1. Push your repo to GitHub with `backend` as a subfolder and ensure `Project_Data.csv` is inside `backend`.
2. On Railway: **New Project → Deploy from Repo** → select your GitHub repo.
3. Service root: set to `backend`.
4. Build command: `go build -o server ./...`
5. Start command: `./server`
6. Env vars:
   - `PORT=8080`
   - `DB_DSN=<your Railway MySQL DSN>`
7. Deploy. The public URL appears in the service Overview under Domains, e.g. `https://<backend>.up.railway.app`. API base: `https://<backend>.up.railway.app/api`.

### Frontend (Next.js)
1. In the same Railway project: **New Service → Deploy from Repo** → select the same repo, set root to `frontend`.
2. Build command: `npm install && npm run build` (or `yarn install && yarn build`).
3. Start command: `npm run start` (or `yarn start`).
4. Env vars:
   - `NEXT_PUBLIC_API_BASE=https://<backend>.up.railway.app/api`
   - `PORT=3000` (Railway will map it)
5. Deploy. The frontend service shows its public URL in Domains (e.g. `https://<frontend>.up.railway.app`). Open it to view the live app.

Notes:
- If Railway requires a specific Go version, set `go.mod` to a supported version (e.g., `go 1.22`) and redeploy.
- The backend seeds from `Project_Data.csv` on first boot; if rows already exist, seeding is skipped.

## Running locally
```bash
cd backend
go mod tidy
go run main.go
```

## Notes on data model
- Single table `transactions` with embedded prefixes:
  - `customer_*`, `product_*`, `sales_*`, `logistics_*`
- Sorting supports `date`, `quantity`, and `customer_name` (aliases camelCase).
- Tag filtering uses `LIKE` per tag; gender supports multiple values (`IN` clause).

