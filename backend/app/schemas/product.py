from pydantic import BaseModel, ConfigDict, field_validator
from decimal import Decimal
from datetime import datetime
from typing import Optional, List


class ProductBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    unit_price: Decimal
    stock_quantity: int = 0

    @field_validator("sku")
    @classmethod
    def sku_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("SKU cannot be empty")
        return v.strip().upper()

    @field_validator("unit_price")
    @classmethod
    def price_must_be_positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Unit price must be greater than zero")
        return v

    @field_validator("stock_quantity")
    @classmethod
    def stock_must_be_non_negative(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Stock quantity cannot be negative")
        return v


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    unit_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
