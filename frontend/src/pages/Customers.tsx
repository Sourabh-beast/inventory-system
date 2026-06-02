import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "@/hooks/useCustomers";
import { formatDate } from "@/lib/utils";
import type { Customer, CustomerFormData } from "@/types";

const GRADIENTS = [
  ["#6366F1","#8B5CF6"],["#8B5CF6","#D946EF"],["#06B6D4","#6366F1"],
  ["#10B981","#06B6D4"],["#F59E0B","#EF4444"],["#EF4444","#8B5CF6"],
  ["#F472B6","#FB923C"],
];

function Avatar({ name, size = 8 }: { name: string; size?: number }) {
  const g = GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center shrink-0 font-bold text-white`}
      style={{
        width: `${size * 4}px`, height: `${size * 4}px`,
        background: `linear-gradient(145deg, ${g[0]}, ${g[1]})`,
        fontSize: `${size * 1.5}px`,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

const EMPTY: CustomerFormData = { full_name: "", email: "", phone: "" };

export default function Customers() {
  const [search, setSearch]   = useState("");
  const [dSearch, setDSearch] = useState("");
  const [open, setOpen]       = useState(false);
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm]       = useState<CustomerFormData>(EMPTY);

  useEffect(() => {
    const t = setTimeout(() => setDSearch(search), 280);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useCustomers(dSearch);
  const createMut = useCreateCustomer();
  const updateMut = useUpdateCustomer();
  const deleteMut = useDeleteCustomer();

  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(c: Customer) {
    setEditing(c);
    setForm({ full_name: c.full_name, email: c.email, phone: c.phone ?? "" });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) { await updateMut.mutateAsync({ id: editing.id, data: form }); toast.success("Customer updated"); }
      else { await createMut.mutateAsync(form); toast.success("Customer created"); }
      setOpen(false);
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error"); }
  }

  async function doDelete() {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Deleted");
      setDeleting(null);
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error"); }
  }

  const busy = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#3E3E52] mb-0.5">CRM</p>
          <h1 className="text-[20px] font-bold tracking-[-0.04em] text-[#E4E4F0]">Customers</h1>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          Add Customer
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-[320px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#3E3E52] pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-8"
          />
        </div>
        <span className="ml-auto text-[12px] text-[#3E3E52]">
          {data ? `${data.total} customer${data.total !== 1 ? "s" : ""}` : ""}
        </span>
      </div>

      <div
        className="rounded-[12px] overflow-hidden"
        style={{ background: "#0F0F18", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div
          className="grid px-5 py-3"
          style={{
            gridTemplateColumns: "1fr 200px 140px 120px 64px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.018)",
          }}
        >
          {["Customer", "Email", "Phone", "Joined", ""].map((h) => (
            <span key={h} className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#3E3E52]">{h}</span>
          ))}
        </div>

        {isLoading ? (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid items-center px-5 py-4" style={{ gridTemplateColumns: "1fr 200px 140px 120px 64px" }}>
                {[...Array(5)].map((_, j) => <Skeleton key={j} className="h-4 rounded-[5px]" />)}
              </div>
            ))}
          </div>
        ) : data?.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div
              className="w-12 h-12 rounded-[12px] flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}
            >
              <Users className="w-5 h-5 text-violet-400" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-[#888898]">No customers found</p>
              <p className="text-[12px] text-[#3E3E52] mt-0.5">Add your first customer to get started</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {data?.items.map((c) => (
              <div
                key={c.id}
                className="data-row grid items-center px-5 py-3.5"
                style={{ gridTemplateColumns: "1fr 200px 140px 120px 64px" }}
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <Avatar name={c.full_name} size={8} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#C4C4D4] truncate tracking-[-0.01em]">
                      {c.full_name}
                    </p>
                  </div>
                </div>
                <span className="text-[12.5px] text-[#888898] truncate">{c.email}</span>
                <span className="text-[12.5px] text-[#3E3E52] truncate">
                  {c.phone || <span className="text-[#2A2A38]">—</span>}
                </span>
                <span className="text-[12px] text-[#3E3E52]">{formatDate(c.created_at)}</span>
                <div className="flex items-center justify-end gap-0.5">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(c)} className="text-[#3E3E52] hover:text-[#C4C4D4]">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(c)} className="text-[#3E3E52] hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)]">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Customer" : "New Customer"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update customer information." : "Add a new customer to your records."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Full Name *">
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="e.g. Alexandra Chen" required />
            </Field>
            <Field label="Email Address *">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. alex@example.com" required />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1-555-0100" />
            </Field>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : editing ? "Save Changes" : "Create Customer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <DialogContent className="max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Delete customer?</DialogTitle>
            <DialogDescription>
              <strong className="text-[#C4C4D4]">{deleting?.full_name}</strong> and all their order history will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="destructive" onClick={doDelete} disabled={deleteMut.isPending}>
              {deleteMut.isPending ? "Deleting…" : "Delete Customer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
