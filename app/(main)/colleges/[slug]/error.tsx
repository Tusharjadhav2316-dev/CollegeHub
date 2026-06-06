"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("College detail load error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
      <div className="h-16 w-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-[#0F172A]">Something went wrong</h2>
        <p className="text-sm text-[#64748B] leading-relaxed font-medium">
          This college page could not be loaded. This might be due to a temporary connection timeout or database refresh.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="px-5 py-2.5 border border-[#E2E8F0] hover:bg-slate-50 text-sm font-bold text-[#0F172A] rounded-[8px] transition-colors cursor-pointer"
        >
          Go Back
        </button>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold rounded-[8px] transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
