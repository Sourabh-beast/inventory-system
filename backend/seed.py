"""
Seed script — populates the database with realistic sample data.
Run: python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine, Base
from app.models import Product, Customer, Order, OrderItem
from decimal import Decimal

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        if db.query(Product).count() > 0:
            print("Database already seeded. Skipping.")
            return

        products = [
            Product(sku="PRD-001", name="Wireless Ergonomic Mouse", description="Precision wireless mouse with ergonomic design", unit_price=Decimal("49.99"), stock_quantity=150),
            Product(sku="PRD-002", name="Mechanical Keyboard TKL", description="Tenkeyless mechanical keyboard with Cherry MX switches", unit_price=Decimal("129.99"), stock_quantity=75),
            Product(sku="PRD-003", name="27\" 4K Monitor", description="Ultra-sharp 4K IPS display with USB-C", unit_price=Decimal("449.99"), stock_quantity=30),
            Product(sku="PRD-004", name="USB-C Hub 7-in-1", description="7-port USB-C hub with HDMI and ethernet", unit_price=Decimal("59.99"), stock_quantity=200),
            Product(sku="PRD-005", name="Noise-Cancelling Headphones", description="Over-ear ANC headphones with 30h battery", unit_price=Decimal("249.99"), stock_quantity=8),
            Product(sku="PRD-006", name="Webcam 1080p Pro", description="Full HD webcam with built-in microphone", unit_price=Decimal("89.99"), stock_quantity=5),
            Product(sku="PRD-007", name="Laptop Stand Aluminum", description="Adjustable aluminum laptop stand", unit_price=Decimal("39.99"), stock_quantity=300),
            Product(sku="PRD-008", name="Cable Management Kit", description="Complete desk cable management solution", unit_price=Decimal("19.99"), stock_quantity=3),
            Product(sku="PRD-009", name="Desk Pad XL", description="Extra-large leather desk pad 90x45cm", unit_price=Decimal("34.99"), stock_quantity=120),
            Product(sku="PRD-010", name="LED Desk Lamp", description="Smart LED lamp with wireless charging base", unit_price=Decimal("79.99"), stock_quantity=65),
        ]
        db.add_all(products)
        db.flush()

        customers = [
            Customer(full_name="Alexandra Chen", email="alex.chen@techcorp.io", phone="+1-555-0101"),
            Customer(full_name="Marcus Rodriguez", email="m.rodriguez@designstudio.co", phone="+1-555-0102"),
            Customer(full_name="Sarah Mitchell", email="sarah.m@startup.dev", phone="+1-555-0103"),
            Customer(full_name="James Okafor", email="james.okafor@enterprise.com", phone="+1-555-0104"),
            Customer(full_name="Priya Sharma", email="priya.s@cloudworks.io", phone="+1-555-0105"),
            Customer(full_name="Ethan Brooks", email="e.brooks@remoteco.net", phone="+1-555-0106"),
            Customer(full_name="Luna Park", email="luna.park@creative.agency", phone="+1-555-0107"),
        ]
        db.add_all(customers)
        db.flush()

        orders_data = [
            (customers[0], [(products[0], 2), (products[3], 1)]),
            (customers[1], [(products[1], 1), (products[6], 2)]),
            (customers[2], [(products[4], 1)]),
            (customers[3], [(products[2], 2), (products[9], 1)]),
            (customers[4], [(products[5], 1), (products[7], 3)]),
        ]

        for customer, items in orders_data:
            total = Decimal("0")
            order_items = []
            for product, qty in items:
                line = product.unit_price * qty
                total += line
                product.stock_quantity -= qty
                order_items.append(
                    OrderItem(
                        product_id=product.id,
                        quantity=qty,
                        price_at_purchase=product.unit_price,
                    )
                )
            order = Order(customer_id=customer.id, total_amount=total, items=order_items)
            db.add(order)

        db.commit()
        print(f"✓ Seeded {len(products)} products, {len(customers)} customers, {len(orders_data)} orders.")
    except Exception as e:
        db.rollback()
        print(f"✗ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
