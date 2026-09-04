import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "emerald";
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "border-transparent bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    emerald:
      "border-transparent bg-emerald-500 text-black font-bold",
    secondary:
      "border-transparent bg-[#161b22] text-gray-300 border border-[#30363d]",
    destructive:
      "border-transparent bg-red-500/10 text-red-400 border border-red-500/20",
    outline:
      "border-[#30363d] text-gray-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
