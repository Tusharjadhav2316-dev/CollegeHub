import React from "react";
import Link from "next/link";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="text-center space-y-6 max-w-md w-full">
        {/* Animated Icon */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mx-auto">
          <GraduationCap className="h-10 w-10" />
        </div>
        <div className="space-y-3">
          <h1 className="text-6xl font-black text-indigo-600">404</h1>
          <h2 className="text-2xl font-bold text-[#0F172A]">Page Not Found</h2>
          <p className="text-sm font-semibold text-[#64748B] leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved to another URL.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-md shadow-indigo-200"
          >
            <Home className="h-4 w-4" />
            Go Back Home
          </Link>
          <Link
            href="/discover"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-bold text-slate-700 bg-white border border-[#E2E8F0] hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Colleges
          </Link>
        </div>
      </div>
    </div>
  );
}
