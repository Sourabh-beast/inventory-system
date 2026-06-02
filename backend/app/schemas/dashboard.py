from pydantic import BaseModel
from decimal import Decimal
from typing import List
from .order import OrderResponse
from .product import ProductResponse


class DashboardStats(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    inventory_value: Decimal
    recent_orders: List[OrderResponse]
    low_stock_products: List[ProductResponse]
