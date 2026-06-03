# Stockflow — Inventory & Order Management System

A production-ready SaaS-style inventory and order management platform built with React, FastAPI, and PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Query |
| Backend | FastAPI, SQLAlchemy 2, Pydantic v2, Alembic |
| Database | Supabase PostgreSQL |
| Container | Docker, Docker Compose |

---

## Quick Start (Docker)

This setup expects a Supabase PostgreSQL connection string in `backend/.env`.

```bash
# 1. Clone and enter the project
cd inventory-system

# 2. Start everything with one command
docker compose up --build

# 3. Open the app
open http://localhost:3000

# 4. API docs
open http://localhost:8000/docs
```

The seed script runs automatically and populates 10 products, 7 customers, and 5 sample orders on the target Supabase database if it is empty.

---

## Local Development

### Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv && source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env

# Run database migrations
alembic upgrade head

# Seed sample data
python seed.py

# Start dev server (hot reload)
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start dev server
npm run dev
# → http://localhost:5173
```

---

## API Documentation

Interactive Swagger UI: `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

### Endpoints

#### Products
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/products` | List products (search, pagination) |
| POST | `/api/v1/products` | Create product |
| GET | `/api/v1/products/{id}` | Get product |
| PUT | `/api/v1/products/{id}` | Update product |
| DELETE | `/api/v1/products/{id}` | Delete product |

#### Customers
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/customers` | List customers (search) |
| POST | `/api/v1/customers` | Create customer |
| GET | `/api/v1/customers/{id}` | Get customer |
| PUT | `/api/v1/customers/{id}` | Update customer |
| DELETE | `/api/v1/customers/{id}` | Delete customer |

#### Orders
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/orders` | List all orders |
| POST | `/api/v1/orders` | Create order (validates & deducts stock) |
| GET | `/api/v1/orders/{id}` | Get order details |

#### Dashboard
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/dashboard` | Aggregated stats, recent orders, low-stock |

---

## Business Rules

- **Unique SKU**: Product SKUs are normalised to uppercase and must be unique.
- **Unique email**: Customer emails must be unique (case-insensitive).
- **Stock validation**: Orders are rejected with HTTP 422 if any line item requests more than available stock.
- **Atomic deduction**: Stock is reduced atomically within the same transaction that creates the order (row-level `SELECT ... FOR UPDATE`).
- **Cascade delete**: Deleting a customer removes their orders; deleting an order removes its line items.

---

## Project Structure

```
inventory-system/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routers
│   │   ├── crud/         # DB operations (repository pattern)
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── config.py     # Settings (pydantic-settings)
│   │   ├── database.py   # Engine, session, Base
│   │   └── main.py       # App factory, middleware, routers
│   ├── alembic/          # Migration scripts
│   ├── seed.py           # Sample data loader
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/       # Design system components
│   │   │   └── layout/   # Sidebar, Header, Layout
│   │   ├── hooks/        # React Query data hooks
│   │   ├── lib/          # api client, utils
│   │   ├── pages/        # Dashboard, Products, Customers, Orders
│   │   └── types/        # TypeScript interfaces
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm install -g vercel
vercel deploy --prod
# Set env var: VITE_API_URL=https://your-backend.onrender.com
```

### Backend → Render

1. Create a new **Web Service** pointing to the `backend/` directory.
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add env var: `DATABASE_URL=<your-supabase-postgres-connection-string>`

### Database → Supabase

1. Create a new Supabase project.
2. Copy the **Connection string** (Session mode, port 5432).
3. Set it as `DATABASE_URL` in `backend/.env` for local Docker and in Render environment variables for production.
4. Run `alembic upgrade head` to apply migrations.

---

## Environment Variables

### Backend `.env`
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend `.env`
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## Sample Data

The seed script creates:

**Products** (10): Wireless Mouse, Mechanical Keyboard, 4K Monitor, USB-C Hub, Headphones, Webcam, Laptop Stand, Cable Kit, Desk Pad, LED Lamp

**Customers** (7): Alexandra Chen, Marcus Rodriguez, Sarah Mitchell, James Okafor, Priya Sharma, Ethan Brooks, Luna Park

**Orders** (5): Various combinations of the above, with stock pre-deducted.
