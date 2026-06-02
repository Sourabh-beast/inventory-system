import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-[8px] px-3 py-2.5",
          "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]",
          "text-[13px] text-[#E4E4F0] tracking-[-0.01em] leading-relaxed",
          "placeholder:text-[#3E3E50]",
          "transition-all duration-150 resize-none",
          "focus-visible:outline-none focus-visible:border-[rgba(99,102,241,0.5)] focus-visible:bg-[rgba(99,102,241,0.05)] focus-visible:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]",
          "hover:border-[rgba(255,255,255,0.12)]",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
