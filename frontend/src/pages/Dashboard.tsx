import { useEffect, useRef, useState } from "react";
import {
  Package, Users, ShoppingCart, DollarSign,
  AlertTriangle, ArrowRight, TrendingUp, Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency, formatDate, getStockStatus } from "@/lib/utils";
import { Link } from "react-router-dom";

/* ─── Count-up animation hook ──────────────────────────────── */
function useCountUp(target: number, duration = 900, enabled = true) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!enabled || target === 0) { setVal(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, enabled]);
  return val;
}

/* ─── Stat card ─────────────────────────────────────────────── */
function StatCard({
  title, raw, display, icon: Icon, accentFrom, accentTo, accentText, delay = 0,
}: {
  title: string; raw: number; display: string;
  icon: React.ElementType; accentFrom: string; accentTo: string; accentText: string;
  delay?: number;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), delay); return () => clearTimeout(t); }, [delay]);
  const count = useCountUp(raw, 900, ready);
  const displayValue = display.startsWith("$")
    ? "$" + count.toLocaleString("en-US")
    : count.toLocaleString("en-US");

  return (
    <div
      className="stat-card p-5 flex flex-col gap-4 cursor-default"
      style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#3E3E52]">
          {title}
        </p>
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(145deg, ${accentFrom}22, ${accentTo}0D)`,
            border: `1px solid ${accentFrom}33`,
          }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: accentText }} strokeWidth={2} />
        </div>
      </div>
      <div>
        <p
          className="text-[34px] font-bold leading-none tabular tracking-[-0.04em] num-gradient"
          style={{ letterSpacing: "-0.035em" }}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
}

/* ─── Stock bar ──────────────────────────────────────────────── */
function StockIndicator({ qty }: { qty: number }) {
  const status = getStockStatus(qty);
  const color =
    status === "out" || status === "critical" ? "#EF4444" :
    status === "low" ? "#F59E0B" : "#10B981";
  const pct = Math.min((qty / 10) * 100, 100);
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}66` }}
        />
      </div>
      <span
        className="font-mono-feature text-[11px] font-medium shrink-0 w-5 text-right"
        style={{ color }}
      >
        {qty}
      </span>
    </div>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────── */
const AVATAR_GRADIENTS = [
  ["#6366F1","#8B5CF6"], ["#8B5CF6","#D946EF"], ["#06B6D4","#6366F1"],
  ["#10B981","#06B6D4"], ["#F59E0B","#EF4444"], ["#EF4444","#8B5CF6"],
];
function Avatar({ name }: { name: string }) {
  const g = AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold text-white"
      style={{ background: `linear-gradient(145deg, ${g[0]}, ${g[1]})` }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div className="space-y-1">
          <Skeleton className="h-7 w-40 rounded-[8px]" />
          <Skeleton className="h-4 w-64 rounded-[6px]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-[14px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="lg:col-span-2 h-72 rounded-[12px]" />
          <Skeleton className="h-72 rounded-[12px]" />
        </div>
      </div>
    );
  }
  if (!data) return null;

  const inventoryNum = parseFloat(data.inventory_value);

  return (
    <div className="space-y-6 max-w-6xl animate-fade-up">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#3E3E52] mb-1">Overview</p>
          <h1 className="text-[22px] font-bold tracking-[-0.04em] text-[#E4E4F0]">
            Inventory Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px]" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <Zap className="w-3 h-3" style={{ color: "#10B981" }} />
          <span className="text-[11px] font-medium" style={{ color: "#10B981" }}>Live data</span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-1">
        <StatCard title="Total Products"  raw={data.total_products}    display={String(data.total_products)}    icon={Package}      accentFrom="#6366F1" accentTo="#8B5CF6" accentText="#818CF8" delay={0}   />
        <StatCard title="Customers"       raw={data.total_customers}   display={String(data.total_customers)}   icon={Users}        accentFrom="#8B5CF6" accentTo="#D946EF" accentText="#A78BFA" delay={60}  />
        <StatCard title="Total Orders"    raw={data.total_orders}      display={String(data.total_orders)}      icon={ShoppingCart} accentFrom="#06B6D4" accentTo="#6366F1" accentText="#22D3EE" delay={120} />
        <StatCard title="Inventory Value" raw={Math.round(inventoryNum)} display={`$${Math.round(inventoryNum)}`} icon={DollarSign}  accentFrom="#10B981" accentTo="#06B6D4" accentText="#34D399" delay={180} />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div
          className="lg:col-span-2 rounded-[12px] overflow-hidden"
          style={{ background: "#0F0F18", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: "#6366F1" }} />
              <span className="text-[13px] font-semibold text-[#C4C4D4] tracking-[-0.01em]">
                Recent Orders
              </span>
            </div>
            <Link
              to="/orders"
              className="flex items-center gap-1 text-[11.5px] font-medium transition-colors hover:text-[#A5B4FC]"
              style={{ color: "#6366F1" }}
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data.recent_orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <ShoppingCart className="w-6 h-6 text-[#2A2A38]" />
              <p className="text-[12.5px] text-[#3E3E52]">No orders yet</p>
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div
                className="grid px-5 py-2.5"
                style={{
                  gridTemplateColumns: "120px 1fr auto auto",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                {["Order", "Customer", "Items", "Total"].map((h) => (
                  <span key={h} className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#3E3E52]">
                    {h}
                  </span>
                ))}
              </div>

              {data.recent_orders.map((order) => (
                <div
                  key={order.id}
                  className="data-row grid items-center px-5 py-3.5"
                  style={{ gridTemplateColumns: "120px 1fr auto auto" }}
                >
                  <span className="id-badge w-fit">
                    #{String(order.id).padStart(4, "0")}
                  </span>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={order.customer.full_name} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[#C4C4D4] truncate tracking-[-0.01em]">
                        {order.customer.full_name}
                      </p>
                      <p className="text-[11px] text-[#3E3E52] truncate">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="justify-self-start">
                    {order.items.length}
                  </Badge>
                  <span
                    className="font-mono-feature text-[13px] font-semibold text-[#E4E4F0] tracking-[-0.02em] text-right"
                    style={{ minWidth: "80px" }}
                  >
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock */}
        <div
          className="rounded-[12px] overflow-hidden"
          style={{ background: "#0F0F18", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center gap-2 px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="w-5 h-5 rounded-[5px] flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)" }}
            >
              <AlertTriangle className="w-3 h-3" style={{ color: "#F59E0B" }} />
            </div>
            <span className="text-[13px] font-semibold text-[#C4C4D4] tracking-[-0.01em]">
              Low Stock Alert
            </span>
            {data.low_stock_products.length > 0 && (
              <span
                className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                {data.low_stock_products.length}
              </span>
            )}
          </div>

          {data.low_stock_products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.1)" }}
              >
                <Package className="w-4 h-4" style={{ color: "#10B981" }} />
              </div>
              <p className="text-[12.5px] text-[#3E3E52]">All stock levels healthy</p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
              {data.low_stock_products.map((p) => (
                <div key={p.id} className="px-5 py-3.5 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[12.5px] font-medium text-[#C4C4D4] truncate pr-2 tracking-[-0.01em]">
                      {p.name}
                    </p>
                    <span className="id-badge shrink-0">{p.sku}</span>
                  </div>
                  <StockIndicator qty={p.stock_quantity} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
