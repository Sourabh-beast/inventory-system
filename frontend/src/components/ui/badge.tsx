import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[5px] px-2 py-0.5 text-[11px] font-medium tracking-[0.01em] border transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-[rgba(99,102,241,0.12)] text-indigo-300 border-[rgba(99,102,241,0.2)]",
        secondary:   "bg-[rgba(255,255,255,0.05)] text-[#888898] border-[rgba(255,255,255,0.08)]",
        success:     "bg-[rgba(16,185,129,0.12)] text-emerald-400 border-[rgba(16,185,129,0.2)]",
        warning:     "bg-[rgba(245,158,11,0.12)] text-amber-400 border-[rgba(245,158,11,0.2)]",
        destructive: "bg-[rgba(239,68,68,0.12)] text-red-400 border-[rgba(239,68,68,0.2)]",
        outline:     "bg-transparent text-[#888898] border-[rgba(255,255,255,0.1)]",
        violet:      "bg-[rgba(139,92,246,0.12)] text-violet-400 border-[rgba(139,92,246,0.2)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
