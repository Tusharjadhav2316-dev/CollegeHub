import React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
      <div className="text-6xl animate-bounce">🎓</div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-[#0F172A]">College not found</h2>
        <p className="text-sm text-[#64748B] leading-relaxed font-medium">
          The college you are looking for does not exist or has been removed.
        </p>
      </div>

      <Link
        href="/discover"
        className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold rounded-[8px] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
      >
        <Compass className="h-4.5 w-4.5" />
        <span>Browse All Colleges</span>
      </Link>
    </div>
  );
}
