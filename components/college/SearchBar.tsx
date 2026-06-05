"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  /** Initial value for controlled usage */
  defaultValue?: string;
  /** Placeholder text override */
  placeholder?: string;
  /** Extra wrapper className */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Called on submit if you want to intercept navigation */
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  defaultValue = "",
  placeholder = "Search colleges, courses, cities...",
  className,
  size = "md",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeStyles = {
    sm: {
      wrapper: "h-10",
      input: "pl-10 pr-20 text-sm",
      icon: "h-4 w-4 left-3",
      btn: "right-1 text-xs px-3 py-1.5 rounded-lg",
    },
    md: {
      wrapper: "h-13",
      input: "pl-12 pr-28 text-base",
      icon: "h-5 w-5 left-4",
      btn: "right-2 text-sm px-4 py-2 rounded-xl",
    },
    lg: {
      wrapper: "h-16",
      input: "pl-14 pr-36 text-lg",
      icon: "h-6 w-6 left-4",
      btn: "right-2 text-base px-5 py-2.5 rounded-xl",
    },
  };

  const s = sizeStyles[size];

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(`/discover?search=${encodeURIComponent(trimmed)}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setQuery("");
      inputRef.current?.blur();
    }
  }

  function clearQuery() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
    >
      {/* Search icon */}
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500",
          s.icon
        )}
        aria-hidden="true"
      />

      {/* Input */}
      <input
        ref={inputRef}
        id="campus-search"
        type="search"
        role="searchbox"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Search colleges, courses, cities"
        className={cn(
          "w-full",
          s.wrapper,
          s.input,
          "rounded-2xl border border-slate-200 dark:border-slate-700",
          "bg-white dark:bg-slate-900",
          "text-slate-900 dark:text-slate-100",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/20",
          "transition-all duration-200"
        )}
      />

      {/* Clear button */}
      {query && (
        <button
          type="button"
          onClick={clearQuery}
          aria-label="Clear search"
          className="absolute right-[6.5rem] top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      {/* Search button */}
      <button
        type="submit"
        aria-label="Search"
        className={cn(
          "absolute top-1/2 -translate-y-1/2",
          s.btn,
          "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
          "text-white font-semibold",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        )}
      >
        Search
      </button>
    </form>
  );
}
