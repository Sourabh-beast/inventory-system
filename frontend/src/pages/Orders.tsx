import { useState } from "react";
import { Plus, ShoppingCart, Trash2, ChevronDown, ChevronUp, Package, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useOrders, useCreateOrder, useDeleteOrder } from "@/hooks/useOrders";
import { useCustomers } from "@/hooks/useCustomers";
import { useAllProducts } from "@/hooks/useProducts";
import { formatCurrency, formatDateFull } from "@/lib/utils";
import type { OrderItemFormData } from "@/types";

const GRADIENTS = [
  ["#6366F1","#8B5CF6"],["#8B5CF6","#D946EF"],["#06B6D4","#6366F1"],
  ["#10B981","#06B6D4"],["#F59E0B","#EF4444"],["#EF4444","#8B5CF6"],
];
function Avatar({ name }: { name: string }) {
  const g = GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold text-white"
      style={{ background: `linear-gradient(145deg, ${g[0]}, ${g[1]})` }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

interface LineItem extends OrderItemFormData { _key: number; }
let _seq = 0;
const newLine = (): LineItem => ({ _key: ++_seq, product_id: 0, quantity: 1 });

export default function Orders() {
  const [open, setOpen]               = useState(false);
  const [expanded, setExpanded]       = useState<number | null>(null);
  const [customerId, setCustomerId]   = useState<number>(0);
  const [lines, setLines]             = useState<LineItem[]>([newLine()]);
  const [cancelId, setCancelId]       = useState<number | null>(null);

  const { data: ordersData, isLoading } = useOrders();
  const { data: customersData }         = useCustomers();
  const { data: productsData }          = useAllProducts();
  const createMut                       = useCreateOrder();
  const deleteMut                       = useDeleteOrder();

  const products  = productsData?.items  ?? [];
  const customers = customersData?.items ?? [];

  function openCreate() { setCustomerId(0); setLines([newLine()]); setOpen(true); }
  const updateLine = (key: number, p: Partial<LineItem>) =>
    setLines((ls) => ls.map((l) => (l._key === key ? { ...l, ...p } : l)));
  const removeLine = (key: number) =>
    setLines((ls) => ls.length > 1 ? ls.filter((l) => l._key !== key) : ls);

  const total = lines.reduce((s, l) => {
    const p = products.find((x) => x.id === l.product_id);
    return s + (p ? parseFloat(p.unit_price) * l.quantity : 0);
  }, 0);

  async function confirmCancel() {
    if (!cancelId) return;
    try {
      await deleteMut.mutateAsync(cancelId);
      toast.success("Order cancelled — stock restored");
      setCancelId(null);
      if (expanded === cancelId) setExpanded(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel order");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId) { toast.error("Select a customer"); return; }
    const valid = lines.filter((l) => l.product_id && l.quantity > 0);
    if (!valid.length) { toast.error("Add at least one product"); return; }
    try {
      await createMut.mutateAsync({
        customer_id: customerId,
        items: valid.map(({ product_id, quantity }) => ({ product_id, quantity })),
      });
      toast.success("Order placed");
      setOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    }
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#3E3E52] mb-0.5">Transactions</p>
          <h1 className="text-[20px] font-bold tracking-[-0.04em] text-[#E4E4F0]">Orders</h1>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          New Order
        </Button>
      </div>

      <div
        className="rounded-[12px] overflow-hidden"
        style={{ background: "#0F0F18", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div
          className="grid px-5 py-3"
          style={{
            gridTemplateColumns: "110px 1fr 80px 180px 110px 40px 40px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.018)",
          }}
        >
          {["Order", "Customer", "Items", "Date", "Total", "", ""].map((h, i) => (
            <span key={i} className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#3E3E52]">{h}</span>
          ))}
        </div>

        {isLoading ? (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid items-center px-5 py-4" style={{ gridTemplateColumns: "110px 1fr 80px 180px 110px 40px 40px" }}>
                {[...Array(7)].map((_, j) => <Skeleton key={j} className="h-4 rounded-[5px]" />)}
              </div>
            ))}
          </div>
        ) : ordersData?.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div
              className="w-12 h-12 rounded-[12px] flex items-center justify-center"
              style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)" }}
            >
              <ShoppingCart className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-[#888898]">No orders yet</p>
              <p className="text-[12px] text-[#3E3E52] mt-0.5">Place your first order to get started</p>
            </div>
          </div>
        ) : (
          <div>
            {ordersData?.items.map((order) => {
              const isExpanded = expanded === order.id;
              return (
                <div key={order.id}>
                  {/* Main row */}
                  <div
                    className="data-row grid items-center px-5 py-3.5 cursor-pointer"
                    style={{ gridTemplateColumns: "110px 1fr 80px 180px 110px 40px 40px" }}
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                  >
                    <span className="id-badge w-fit font-mono-feature">
                      #{String(order.id).padStart(4, "0")}
                    </span>
                    <div className="flex items-center gap-2.5 min-w-0 pr-4">
                      <Avatar name={order.customer.full_name} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#C4C4D4] truncate tracking-[-0.01em]">
                          {order.customer.full_name}
                        </p>
                        <p className="text-[11px] text-[#3E3E52] truncate">{order.customer.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{order.items.length}</Badge>
                    <span className="text-[12px] text-[#3E3E52]">{formatDateFull(order.created_at)}</span>
                    <span className="font-mono-feature text-[13px] font-semibold text-[#E4E4F0] tracking-[-0.02em]">
                      {formatCurrency(order.total_amount)}
                    </span>
                    <button className="flex items-center justify-center w-7 h-7 rounded-[6px] transition-colors hover:bg-[rgba(255,255,255,0.05)] text-[#3E3E52]">
                      {isExpanded
                        ? <ChevronUp className="w-3.5 h-3.5" />
                        : <ChevronDown className="w-3.5 h-3.5" />
                      }
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCancelId(order.id); }}
                      className="flex items-center justify-center w-7 h-7 rounded-[6px] transition-colors hover:bg-[rgba(239,68,68,0.1)] text-[#3E3E52] hover:text-red-400"
                      title="Cancel order"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Expanded items */}
                  {isExpanded && (
                    <div
                      className="px-5 py-3 mx-3 mb-2 rounded-[8px] space-y-2"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#3E3E52] mb-3">
                        Line Items
                      </p>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2"
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-[5px] flex items-center justify-center shrink-0"
                              style={{ background: "rgba(99,102,241,0.1)" }}
                            >
                              <Package className="w-3 h-3 text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-[12.5px] font-medium text-[#C4C4D4] tracking-[-0.01em]">
                                {item.product.name}
                              </p>
                              <p className="text-[11px] text-[#3E3E52] font-mono-feature">{item.product.sku}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[12.5px] font-semibold text-[#E4E4F0] font-mono-feature tracking-[-0.02em]">
                              {formatCurrency(parseFloat(item.price_at_purchase) * item.quantity)}
                            </p>
                            <p className="text-[11px] text-[#3E3E52]">
                              {item.quantity} × {formatCurrency(item.price_at_purchase)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end pt-1">
                        <div className="text-right">
                          <p className="text-[10.5px] uppercase tracking-[0.08em] text-[#3E3E52]">Order Total</p>
                          <p className="text-[15px] font-bold text-[#E4E4F0] font-mono-feature tracking-[-0.03em]">
                            {formatCurrency(order.total_amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel order confirmation dialog */}
      <Dialog open={cancelId !== null} onOpenChange={(v) => { if (!v) setCancelId(null); }}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Cancel order <span className="font-mono text-[#E4E4F0]">#{String(cancelId ?? 0).padStart(4, "0")}</span>?
              All stock will be restored to inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setCancelId(null)}>Keep Order</Button>
            <Button variant="destructive" onClick={confirmCancel} disabled={deleteMut.isPending}>
              {deleteMut.isPending ? "Cancelling…" : "Cancel Order"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New order dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Place New Order</DialogTitle>
            <DialogDescription>
              Select a customer and add products. Stock will be deducted automatically on submission.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            {/* Customer */}
            <div className="space-y-1.5">
              <Label>Customer *</Label>
              <Select value={customerId ? String(customerId) : ""} onValueChange={(v) => setCustomerId(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer…" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.full_name} · {c.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Line items */}
            <div className="space-y-1.5">
              <Label>Products *</Label>
              <div className="space-y-2">
                {lines.map((line) => {
                  const product = products.find((p) => p.id === line.product_id);
                  return (
                    <div key={line._key} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Select
                          value={line.product_id ? String(line.product_id) : ""}
                          onValueChange={(v) => updateLine(line._key, { product_id: parseInt(v) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product…" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)} disabled={p.stock_quantity === 0}>
                                {p.name} · {formatCurrency(p.unit_price)} ({p.stock_quantity} left)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {product && (
                          <p className="text-[11px] text-[#3E3E52] mt-1 pl-0.5 font-mono-feature">
                            {formatCurrency(product.unit_price)} each · {product.stock_quantity} available
                          </p>
                        )}
                      </div>
                      <Input
                        type="number" min="1"
                        max={product?.stock_quantity ?? 999}
                        value={line.quantity}
                        onChange={(e) => updateLine(line._key, { quantity: parseInt(e.target.value) || 1 })}
                        className="w-[72px] shrink-0 font-mono-feature text-center"
                      />
                      <Button
                        type="button" variant="ghost" size="icon-sm"
                        onClick={() => removeLine(line._key)}
                        className="text-[#3E3E52] hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)] mt-0.5 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <Button
                type="button" variant="outline" size="sm"
                onClick={() => setLines((ls) => [...ls, newLine()])}
                className="w-full mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Line Item
              </Button>
            </div>

            {/* Total */}
            {total > 0 && (
              <div
                className="flex items-center justify-between rounded-[10px] px-4 py-3"
                style={{
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.18)",
                }}
              >
                <span className="text-[12.5px] font-medium text-[#888898]">Order Total</span>
                <span className="font-mono-feature text-[18px] font-bold text-[#E4E4F0] tracking-[-0.03em]">
                  {formatCurrency(total)}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending}>
                {createMut.isPending ? "Placing…" : "Place Order"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
