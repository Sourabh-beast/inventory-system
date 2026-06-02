from sqlalchemy.orm import Session, joinedload
from typing import Tuple, List
from decimal import Decimal
from fastapi import HTTPException, status
from ..models.order import Order, OrderItem
from ..models.product import Product
from ..schemas.order import OrderCreate


class OrderCRUD:
    def get(self, db: Session, order_id: int):
        return (
            db.query(Order)
            .options(
                joinedload(Order.customer),
                joinedload(Order.items).joinedload(OrderItem.product),
            )
            .filter(Order.id == order_id)
            .first()
        )

    def get_many(self, db: Session) -> Tuple[List[Order], int]:
        query = (
            db.query(Order)
            .options(
                joinedload(Order.customer),
                joinedload(Order.items).joinedload(OrderItem.product),
            )
            .order_by(Order.created_at.desc())
        )
        total = db.query(Order).count()
        return query.all(), total

    def get_recent(self, db: Session, limit: int = 5) -> List[Order]:
        return (
            db.query(Order)
            .options(
                joinedload(Order.customer),
                joinedload(Order.items).joinedload(OrderItem.product),
            )
            .order_by(Order.created_at.desc())
            .limit(limit)
            .all()
        )

    def create(self, db: Session, data: OrderCreate) -> Order:
        # Validate stock for all items atomically before making any changes
        product_map: dict[int, Product] = {}
        for item_data in data.items:
            product = (
                db.query(Product)
                .filter(Product.id == item_data.product_id)
                .with_for_update()
                .first()
            )
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product with id {item_data.product_id} not found",
                )
            if product.stock_quantity < item_data.quantity:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Insufficient stock for '{product.name}'. Available: {product.stock_quantity}, requested: {item_data.quantity}",
                )
            product_map[item_data.product_id] = product

        # Deduct stock and build order items
        total = Decimal("0")
        order_items = []
        for item_data in data.items:
            product = product_map[item_data.product_id]
            product.stock_quantity -= item_data.quantity
            line_total = product.unit_price * item_data.quantity
            total += line_total
            order_items.append(
                OrderItem(
                    product_id=item_data.product_id,
                    quantity=item_data.quantity,
                    price_at_purchase=product.unit_price,
                )
            )

        order = Order(customer_id=data.customer_id, total_amount=total, items=order_items)
        db.add(order)
        db.commit()
        db.refresh(order)

        # Return fully loaded order
        return self.get(db, order.id)


order_crud = OrderCRUD()
