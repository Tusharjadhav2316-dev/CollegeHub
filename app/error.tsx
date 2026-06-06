"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center p-6">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 max-w-md w-full text-center shadow-lg space-y-6 animate-fade-in">
        <div className="h-16 w-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-sm">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#0F172A]">Something went wrong</h1>
          <p className="text-sm font-semibold text-[#64748B] leading-relaxed">
            An unexpected error occurred while loading this page. Please try reloading or returning home.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold text-slate-700 bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-all active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
