import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] transition-transform duration-100 cursor-pointer";

    // Variant styles
    const variants = {
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 border border-transparent dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus-visible:ring-indigo-400",
      secondary:
        "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 focus-visible:ring-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700",
      danger:
        "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 border border-transparent dark:bg-red-600 dark:hover:bg-red-700 dark:focus-visible:ring-red-500",
      ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
    };

    // Size styles
    const sizes = {
      sm: "px-3 py-1.5 text-xs font-semibold rounded-lg",
      md: "px-4 py-2.5 text-sm font-semibold rounded-xl",
      lg: "px-6 py-3.5 text-base font-semibold rounded-xl",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
