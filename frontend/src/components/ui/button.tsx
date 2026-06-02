import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
    "text-[13px] font-medium tracking-[-0.01em]",
    "rounded-[8px] select-none cursor-pointer",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-0",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-brand text-white",
          "shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]",
          "hover:bg-indigo-500 hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)]",
        ].join(" "),
        secondary: [
          "bg-[rgba(255,255,255,0.07)] text-[#C4C4D4] border border-[rgba(255,255,255,0.08)]",
          "hover:bg-[rgba(255,255,255,0.1)] hover:text-white hover:border-[rgba(255,255,255,0.12)]",
        ].join(" "),
        ghost: [
          "text-[#888898]",
          "hover:bg-[rgba(255,255,255,0.05)] hover:text-[#C4C4D4]",
        ].join(" "),
        destructive: [
          "bg-[rgba(239,68,68,0.12)] text-red-400 border border-[rgba(239,68,68,0.2)]",
          "hover:bg-[rgba(239,68,68,0.2)] hover:text-red-300",
        ].join(" "),
        outline: [
          "bg-transparent text-[#C4C4D4] border border-[rgba(255,255,255,0.1)]",
          "hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)]",
        ].join(" "),
        link: "text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300",
      },
      size: {
        default: "h-8 px-3.5 py-1.5",
        sm: "h-7 px-3 py-1 text-xs rounded-[6px]",
        lg: "h-10 px-5 text-sm",
        icon: "h-8 w-8 p-0",
        "icon-sm": "h-7 w-7 p-0 rounded-[6px]",
        "icon-xs": "h-6 w-6 p-0 rounded-[5px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
