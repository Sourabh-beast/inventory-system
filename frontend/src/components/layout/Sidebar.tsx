import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products",  label: "Products",  icon: Package },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/orders",    label: "Orders",    icon: ShoppingCart },
];

export default function Sidebar() {
  return (
    <aside
      className="relative flex flex-col h-screen shrink-0 select-none"
      style={{
        width: 220,
        background: "#07070D",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5) 50%, transparent)",
        }}
      />

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
        <div
          className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(145deg, #6366F1, #8B5CF6)",
            boxShadow: "0 2px 12px rgba(99,102,241,0.4)",
          }}
        >
          <Activity className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span
            className="text-[14px] font-semibold tracking-[-0.03em]"
            style={{ color: "#E4E4F0" }}
          >
            Stockflow
          </span>
        </div>
      </div>

      {/* Nav section */}
      <div className="flex-1 px-2 py-2 space-y-px overflow-y-auto">
        <p
          className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
          style={{ color: "#343448" }}
        >
          Navigation
        </p>
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end>
            {({ isActive }) => (
              <span
                className={cn(
                  "nav-item",
                  isActive && "active",
                  !isActive && "nav-item"
                )}
                style={
                  isActive
                    ? {
                        background: "rgba(99,102,241,0.1)",
                        color: "#A5B4FC",
                        borderLeft: "none",
                        position: "relative",
                      }
                    : undefined
                }
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full"
                    style={{ background: "#818CF8" }}
                  />
                )}
                <Icon
                  className={cn("nav-icon w-4 h-4 shrink-0 transition-colors")}
                  style={{ color: isActive ? "#818CF8" : "#3E3E52" }}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span>{label}</span>
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Separator */}
      <div
        className="mx-3 h-px"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />

      {/* User profile */}
      <div className="px-3 py-4">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-[8px] transition-colors hover:bg-[rgba(255,255,255,0.04)] cursor-pointer group">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
            style={{
              background: "linear-gradient(145deg, #6366F1, #8B5CF6)",
              boxShadow: "0 0 0 1.5px rgba(99,102,241,0.3)",
            }}
          >
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-medium text-[#C4C4D4] truncate tracking-[-0.01em]">
              Admin User
            </p>
            <p className="text-[11px] truncate" style={{ color: "#3E3E52" }}>
              admin@stockflow.io
            </p>
          </div>
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: "#10B981", boxShadow: "0 0 5px rgba(16,185,129,0.6)" }}
          />
        </div>
      </div>
    </aside>
  );
}
