import { useState } from "react";
import { Search, Bell } from "lucide-react";

function useNow() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export default function Header() {
  const [focused, setFocused] = useState(false);
  const date = useNow();

  return (
    <header
      className="relative flex h-12 items-center gap-4 px-5 shrink-0"
      style={{
        background: "rgba(7,7,13,0.75)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        zIndex: 30,
      }}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-[300px]">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none transition-colors duration-150"
          style={{ color: focused ? "#818CF8" : "#3E3E52" }}
        />
        <input
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search..."
          className="w-full h-7 pl-8 pr-12 rounded-[7px] text-[12.5px] placeholder:text-[#3E3E52] tracking-[-0.01em] transition-all duration-150 focus:outline-none"
          style={{
            background: focused ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${focused ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`,
            color: "#E4E4F0",
            boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
          }}
        />
        <span className="kbd absolute right-2.5 top-1/2 -translate-y-1/2">⌘K</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Date badge */}
        <span
          className="text-[11.5px] font-medium tracking-[-0.01em] hidden sm:block"
          style={{ color: "#3E3E52" }}
        >
          {date}
        </span>

        <div
          className="w-px h-4 hidden sm:block"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />

        {/* Notification bell placeholder */}
        <button
          className="relative flex h-7 w-7 items-center justify-center rounded-[7px] transition-colors hover:bg-[rgba(255,255,255,0.05)]"
          style={{ color: "#3E3E52" }}
        >
          <Bell className="w-3.5 h-3.5" />
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ background: "#6366F1", boxShadow: "0 0 5px rgba(99,102,241,0.7)" }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: "linear-gradient(145deg, #6366F1, #8B5CF6)",
            boxShadow: "0 0 0 1.5px rgba(99,102,241,0.3), 0 2px 8px rgba(99,102,241,0.2)",
          }}
        >
          A
        </div>
      </div>
    </header>
  );
}
