from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..crud.order import order_crud
from ..crud.customer import customer_crud
from ..schemas.order import OrderCreate, OrderResponse, OrderListResponse

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=OrderListResponse)
def list_orders(db: Session = Depends(get_db)):
    items, total = order_crud.get_many(db)
    return OrderListResponse(items=items, total=total)


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(data: OrderCreate, db: Session = Depends(get_db)):
    if not customer_crud.get(db, data.customer_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with id {data.customer_id} not found",
        )
    return order_crud.create(db, data)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = order_crud.get(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order
