from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional, Tuple, List
from ..models.product import Product
from ..schemas.product import ProductCreate, ProductUpdate


class ProductCRUD:
    def get(self, db: Session, product_id: int) -> Optional[Product]:
        return db.query(Product).filter(Product.id == product_id).first()

    def get_by_sku(self, db: Session, sku: str) -> Optional[Product]:
        return db.query(Product).filter(Product.sku == sku.upper()).first()

    def get_many(
        self,
        db: Session,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[Product], int]:
        query = db.query(Product)
        if search:
            term = f"%{search}%"
            query = query.filter(
                or_(Product.name.ilike(term), Product.sku.ilike(term))
            )
        total = query.count()
        items = (
            query.order_by(Product.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        return items, total

    def get_low_stock(self, db: Session, threshold: int = 10) -> List[Product]:
        return (
            db.query(Product)
            .filter(Product.stock_quantity <= threshold)
            .order_by(Product.stock_quantity.asc())
            .limit(10)
            .all()
        )

    def get_inventory_value(self, db: Session) -> float:
        result = db.query(
            func.sum(Product.unit_price * Product.stock_quantity)
        ).scalar()
        return float(result or 0)

    def create(self, db: Session, data: ProductCreate) -> Product:
        product = Product(**data.model_dump())
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    def update(self, db: Session, product: Product, data: ProductUpdate) -> Product:
        update_data = data.model_dump(exclude_unset=True)
        if "sku" in update_data and update_data["sku"]:
            update_data["sku"] = update_data["sku"].strip().upper()
        for field, value in update_data.items():
            setattr(product, field, value)
        db.commit()
        db.refresh(product)
        return product

    def delete(self, db: Session, product: Product) -> None:
        db.delete(product)
        db.commit()


product_crud = ProductCRUD()
