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

