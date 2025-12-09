Here is a clean, polished, *human-written* README that fully includes **frontend + backend + deployment** in one document.
This is suitable for GitHub and looks like a real project README — not AI-generated, not tutorial-style.

---

# Sales Management Dashboard

A full-stack sales analytics platform built with **Next.js**, **Go (Gin + GORM)**, and **MySQL**, designed for fast filtering, searching, and summarizing large sales datasets.
Both the **frontend and backend are deployed on Railway**.

---

## Tech Stack

### **Frontend**

* Next.js 14 (App Router)
* React 18
* Tailwind CSS
* Axios
* date-fns

### **Backend**

* Go (Gin Framework)
* GORM ORM
* MySQL (Railway Managed)
* CSV seeding on first startup

### **Deployment**

* **Railway** (Frontend)
* **Railway** (Backend)
* **Railway MySQL** database

---

## Project Structure

```
/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── main.go
│
└── frontend/
    ├── app/
    ├── components/
    ├── hooks/
    ├── types/
    ├── utils/
    ├── tailwind.config.js
    ├── package-lock.json
    ├── package.json
    └── next.config.js
```

---

# 🛠 Backend (Go / Gin / GORM)

The backend exposes REST APIs for:

* Fetching paginated and filtered sales records
* Aggregated summary metrics
* Distinct filter options for the frontend

### Architecture

```
Frontend → Gin Router → Controllers → Services → MySQL
```

### Responsibilities

* **main.go**

  * loads env variables
  * connects to MySQL
  * auto-migrates the `Transaction` model
  * seeds CSV on first run
* **services/**

  * filtering, sorting, pagination, aggregation
* **controllers/**

  * parameter parsing + mapping to camelCase DTOs
* **routes/**

  * all API routes + middleware
* **models/**

  * GORM models + response types

---

## Backend API

### **GET /api/sales**

Paginated list of transactions with:

* search
* sorting
* region / gender / category / tag filters
* age range
* date range

### **GET /api/sales/summary**

Aggregated totals:

* units sold
* total amount
* total discount
* transaction count

### **GET /api/filters/options**

Distinct lists:

* categories
* tags
* genders
* regions
* payment methods

---

# Frontend (Next.js)

The frontend is a fully interactive dashboard built using:

* **Next.js App Router**
* **Tailwind CSS**
* **Client-side filtering with server-side data fetching**
* **Reusable chart and table components**

### Features

* Live search + multi-filter UI
* Paginated table with sorting
* Summary stats cards
* Date range filtering
* Responsive mobile-friendly layout

---

# Deployment (Railway)

Both services run on **Railway**, using separate services for frontend, backend, and MySQL.

### **Frontend (Next.js)**

* Automatically built on push
* Served on a Railway static deployment

### **Backend (Go / Gin)**

* Deployed as a Railway container
* Environment variables set via Railway dashboard
* Connected to Railway MySQL

### **MySQL (Railway Managed)**

* Stores all transactions
* Connected to backend using the Railway-provided DSN

---

# Local Development

### Start backend:

```bash
cd backend
go mod tidy
go run main.go
```

### Start frontend:

```bash
cd frontend
npm install
npm run dev
```

