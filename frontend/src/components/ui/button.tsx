import * as React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "emerald";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] active:scale-[0.98] select-none";

    const variantStyles = {
      default:
        "bg-emerald-500 text-black hover:bg-emerald-400 font-semibold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:brightness-105",
      emerald:
        "bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold hover:brightness-110 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/45",
      secondary:
        "bg-[#161b22] text-gray-200 hover:bg-[#21262d] hover:text-white border border-[#30363d] hover:border-gray-500 shadow-sm",
      outline:
        "border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/70 hover:shadow-sm hover:shadow-emerald-500/20",
      ghost:
        "text-gray-300 hover:bg-[#161b22] hover:text-emerald-400",
      destructive:
        "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50 hover:text-red-300 shadow-sm hover:shadow-red-500/20",
    };

    const sizeStyles = {
      default: "h-11 px-5 py-2.5",
      sm: "h-9 rounded-lg px-3.5 text-xs",
      lg: "h-12 rounded-xl px-7 text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
