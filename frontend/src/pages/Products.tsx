import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Package, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { formatCurrency, formatDate, getStockStatus } from "@/lib/utils";
import type { Product, ProductFormData } from "@/types";

/* ─── Stock badge ────────────────────────────────────────────── */
function StockBadge({ qty }: { qty: number }) {
  const s = getStockStatus(qty);
  if (s === "out")      return <Badge variant="destructive">Out of stock</Badge>;
  if (s === "critical") return <Badge variant="destructive">{qty} left</Badge>;
  if (s === "low")      return <Badge variant="warning">{qty} low</Badge>;
  return <Badge variant="success">{qty} in stock</Badge>;
}

/* ─── Field wrapper ──────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

const EMPTY: ProductFormData = { sku: "", name: "", description: "", unit_price: "", stock_quantity: 0 };

export default function Products() {
  const [search, setSearch]               = useState("");
  const [dSearch, setDSearch]             = useState("");
  const [page, setPage]                   = useState(1);
  const [open, setOpen]                   = useState(false);
  const [deleting, setDeleting]           = useState<Product | null>(null);
  const [editing, setEditing]             = useState<Product | null>(null);
  const [form, setForm]                   = useState<ProductFormData>(EMPTY);

  useEffect(() => {
    const t = setTimeout(() => { setDSearch(search); setPage(1); }, 280);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading }   = useProducts(dSearch, page);
  const createMut             = useCreateProduct();
  const updateMut             = useUpdateProduct();
  const deleteMut             = useDeleteProduct();

  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(p: Product) {
    setEditing(p);
    setForm({ sku: p.sku, name: p.name, description: p.description ?? "", unit_price: p.unit_price, stock_quantity: p.stock_quantity });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, unit_price: String(form.unit_price), stock_quantity: Number(form.stock_quantity) };
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data: payload });
        toast.success("Product updated");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Product created");
      }
      setOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  async function doDelete() {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Deleted");
      setDeleting(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  const busy = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#3E3E52] mb-0.5">Catalog</p>
          <h1 className="text-[20px] font-bold tracking-[-0.04em] text-[#E4E4F0]">Products</h1>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          Add Product
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-[320px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#3E3E52] pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU…"
            className="pl-8"
          />
        </div>
        <Button variant="secondary" size="sm" className="gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
        </Button>
        <span className="ml-auto text-[12px] text-[#3E3E52]">
          {data ? `${data.total} product${data.total !== 1 ? "s" : ""}` : ""}
        </span>
      </div>

      {/* Table */}
      <div
        className="rounded-[12px] overflow-hidden"
        style={{ background: "#0F0F18", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div
          className="grid px-5 py-3"
          style={{
            gridTemplateColumns: "140px 1fr 100px 110px 120px 64px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.018)",
          }}
        >
          {["SKU", "Product", "Price", "Stock", "Created", ""].map((h) => (
            <span key={h} className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#3E3E52]">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grid px-5 py-4" style={{ gridTemplateColumns: "140px 1fr 100px 110px 120px 64px" }}>
                {[...Array(6)].map((_, j) => <Skeleton key={j} className="h-4 rounded-[5px]" />)}
              </div>
            ))}
          </div>
        ) : data?.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div
              className="w-12 h-12 rounded-[12px] flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
            >
              <Package className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-[#888898]">No products found</p>
              <p className="text-[12px] text-[#3E3E52] mt-0.5">Try adjusting your search</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {data?.items.map((p) => (
              <div
                key={p.id}
                className="data-row grid items-center px-5 py-3.5"
                style={{ gridTemplateColumns: "140px 1fr 100px 110px 120px 64px" }}
              >
                <span className="id-badge w-fit font-mono-feature">{p.sku}</span>
                <div className="min-w-0 pr-4">
                  <p className="text-[13px] font-medium text-[#C4C4D4] truncate tracking-[-0.01em]">{p.name}</p>
                  {p.description && (
                    <p className="text-[11px] text-[#3E3E52] truncate mt-0.5">{p.description}</p>
                  )}
                </div>
                <span className="font-mono-feature text-[13px] font-semibold text-[#E4E4F0] tracking-[-0.02em]">
                  {formatCurrency(p.unit_price)}
                </span>
                <div><StockBadge qty={p.stock_quantity} /></div>
                <span className="text-[12px] text-[#3E3E52]">{formatDate(p.created_at)}</span>
                <div className="flex items-center justify-end gap-0.5">
                  <Button
                    variant="ghost" size="icon-sm"
                    onClick={() => openEdit(p)}
                    className="text-[#3E3E52] hover:text-[#C4C4D4]"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon-sm"
                    onClick={() => setDeleting(p)}
                    className="text-[#3E3E52] hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#3E3E52]">
            Page {page} of {data.total_pages}
          </span>
          <div className="flex gap-1">
            <Button variant="secondary" size="icon-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button variant="secondary" size="icon-sm" disabled={page === data.total_pages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update product details." : "Add a new product to your inventory catalog."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="SKU *">
                <Input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="e.g. PRD-001"
                  className="font-mono-feature uppercase"
                  required
                />
              </Field>
              <Field label="Unit Price *">
                <Input
                  type="number" step="0.01" min="0.01"
                  value={form.unit_price}
                  onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </Field>
            </div>
            <Field label="Product Name *">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Wireless Ergonomic Mouse"
                required
              />
            </Field>
            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description…"
                rows={2}
              />
            </Field>
            <Field label="Stock Quantity">
              <Input
                type="number" min="0"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: parseInt(e.target.value) || 0 })}
              />
            </Field>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : editing ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <DialogContent className="max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              <strong className="text-[#C4C4D4]">{deleting?.name}</strong> will be permanently removed. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="destructive" onClick={doDelete} disabled={deleteMut.isPending}>
              {deleteMut.isPending ? "Deleting…" : "Delete Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
