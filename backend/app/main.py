from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .models import Product, Customer, Order, OrderItem  # noqa: F401 — registers ORM models
from .api.products import router as products_router
from .api.customers import router as customers_router
from .api.orders import router as orders_router
from .api.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory & Order Management API",
    description="Production-ready REST API for managing products, customers, orders, and inventory.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

origins = settings.origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=(origins != ["*"]),  # credentials not compatible with wildcard origin
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router, prefix="/api/v1")
app.include_router(customers_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "version": "1.0.0"}
