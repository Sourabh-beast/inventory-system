from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, Tuple, List
from ..models.customer import Customer
from ..schemas.customer import CustomerCreate, CustomerUpdate


class CustomerCRUD:
    def get(self, db: Session, customer_id: int) -> Optional[Customer]:
        return db.query(Customer).filter(Customer.id == customer_id).first()

    def get_by_email(self, db: Session, email: str) -> Optional[Customer]:
        return db.query(Customer).filter(Customer.email == email.lower()).first()

    def get_many(
        self,
        db: Session,
        search: Optional[str] = None,
    ) -> Tuple[List[Customer], int]:
        query = db.query(Customer)
        if search:
            term = f"%{search}%"
            query = query.filter(
                or_(
                    Customer.full_name.ilike(term),
                    Customer.email.ilike(term),
                )
            )
        total = query.count()
        items = query.order_by(Customer.created_at.desc()).all()
        return items, total

    def create(self, db: Session, data: CustomerCreate) -> Customer:
        customer = Customer(**data.model_dump())
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer

    def update(self, db: Session, customer: Customer, data: CustomerUpdate) -> Customer:
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(customer, field, value)
        db.commit()
        db.refresh(customer)
        return customer

    def delete(self, db: Session, customer: Customer) -> None:
        db.delete(customer)
        db.commit()


customer_crud = CustomerCRUD()
