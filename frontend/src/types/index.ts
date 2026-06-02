export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  unit_price: string;
  stock_quantity: number;
  created_at: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface CustomerListResponse {
  items: Customer[];
  total: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: string;
  product: Product;
}

export interface Order {
  id: number;
  customer_id: number;
  total_amount: string;
  created_at: string;
  customer: Customer;
  items: OrderItem[];
}

export interface OrderListResponse {
  items: Order[];
  total: number;
}

export interface DashboardStats {
  total_products: number;
  total_customers: number;
  total_orders: number;
  inventory_value: string;
  recent_orders: Order[];
  low_stock_products: Product[];
}

// Form types
export interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  unit_price: string;
  stock_quantity: number;
}

export interface CustomerFormData {
  full_name: string;
  email: string;
  phone: string;
}

export interface OrderItemFormData {
  product_id: number;
  quantity: number;
}

export interface OrderFormData {
  customer_id: number;
  items: OrderItemFormData[];
}
