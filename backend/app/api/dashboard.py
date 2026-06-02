from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..crud.product import product_crud
from ..crud.customer import customer_crud
from ..crud.order import order_crud
from ..schemas.dashboard import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardStats)
def get_dashboard(db: Session = Depends(get_db)):
    _, total_products = product_crud.get_many(db)
    _, total_customers = customer_crud.get_many(db)
    _, total_orders = order_crud.get_many(db)
    inventory_value = product_crud.get_inventory_value(db)
    recent_orders = order_crud.get_recent(db, limit=5)
    low_stock = product_crud.get_low_stock(db, threshold=10)

    return DashboardStats(
        total_products=total_products,
        total_customers=total_customers,
        total_orders=total_orders,
        inventory_value=inventory_value,
        recent_orders=recent_orders,
        low_stock_products=low_stock,
    )
