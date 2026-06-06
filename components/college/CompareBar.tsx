"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { useCompareStore } from "@/lib/compare-store";

export default function CompareBar() {
  const [mounted, setMounted] = useState(false);
  const { compareList, removeCollege, clearCompare } = useCompareStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || compareList.length === 0) {
    return null;
  }

  // Create exactly 4 slots
  const slots = Array.from({ length: 4 }, (_, i) => compareList[i] || null);

  const compareUrl = `/compare?ids=${compareList.map((c) => c.id).join(",")}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-white border-t border-[#E2E8F0] shadow-2xl z-50 flex items-center transition-all duration-300 animate-slide-up">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Previews list */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-1">
          {slots.map((college, idx) => {
            if (college) {
              return (
                <div key={college.id} className="relative flex flex-col items-center group shrink-0">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeCollege(college.id)}
                    className="absolute -top-1 -right-1 h-4.5 w-4.5 bg-slate-100 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center text-slate-500 shadow-sm transition-colors z-10 cursor-pointer"
                    aria-label={`Remove ${college.name} from compare`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>

                  {/* Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={college.thumbnail}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover border border-[#E2E8F0] bg-slate-50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(college.name)}&background=4F46E5&color=fff&size=80`;
                    }}
                  />
                  <span className="text-[10px] font-bold text-slate-500 mt-1 max-w-[60px] truncate">
                    {college.name}
                  </span>
                </div>
              );
            }

            return (
              <div key={idx} className="flex flex-col items-center shrink-0">
                <div className="h-10 w-10 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-slate-400">
                  <span className="text-xs font-bold">{idx + 1}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 mt-1">
                  Empty
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Clear All
          </button>
          
          <Link
            href={compareUrl}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all"
          >
            Compare Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
