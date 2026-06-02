import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded-[8px] px-3 py-1.5",
          "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]",
          "text-[13px] text-[#E4E4F0] tracking-[-0.01em]",
          "placeholder:text-[#3E3E50]",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:border-[rgba(99,102,241,0.5)] focus-visible:bg-[rgba(99,102,241,0.05)] focus-visible:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]",
          "hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.06)]",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "file:border-0 file:bg-transparent file:text-sm",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
