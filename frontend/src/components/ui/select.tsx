import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-8 w-full items-center justify-between gap-2 rounded-[8px] px-3",
      "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]",
      "text-[13px] text-[#E4E4F0] tracking-[-0.01em]",
      "transition-all duration-150",
      "hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.06)]",
      "focus:outline-none focus:border-[rgba(99,102,241,0.5)] focus:bg-[rgba(99,102,241,0.05)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]",
      "disabled:cursor-not-allowed disabled:opacity-40",
      "[&>span]:line-clamp-1 [&>span]:text-left",
      "data-[placeholder]:text-[#3E3E50]",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-3.5 w-3.5 text-[#505060] shrink-0" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-[60] max-h-64 overflow-hidden rounded-[10px]",
        "bg-[#1A1A28] border border-[rgba(255,255,255,0.1)]",
        "shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_0_1px_rgba(99,102,241,0.08)]",
        "data-[state=open]:animate-scale-in",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-[#505060]">
        <ChevronDown className="h-3 w-3 rotate-180" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className={cn("p-1", position === "popper" && "min-w-[var(--radix-select-trigger-width)]")}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-[#505060]">
        <ChevronDown className="h-3 w-3" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-[#505060]", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-[7px] py-2 pl-2.5 pr-8",
      "text-[13px] text-[#C4C4D4] tracking-[-0.01em]",
      "outline-none transition-colors",
      "focus:bg-[rgba(255,255,255,0.06)] focus:text-[#E4E4F0]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5 text-indigo-400" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem };
