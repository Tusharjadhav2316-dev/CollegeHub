import React from "react";

export default function Loading() {
  return (
    <div className="w-full bg-[#F8F9FF] min-h-screen space-y-8 pb-12">
      {/* Breadcrumb Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="h-4.5 w-60 bg-slate-200 rounded-[6px] animate-pulse"></div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="w-full h-[320px] md:h-[480px] bg-slate-200 animate-pulse relative">
        <div className="absolute bottom-12 left-6 md:left-12 space-y-4 w-3/4 max-w-lg">
          <div className="h-6 w-32 bg-slate-300 rounded-full"></div>
          <div className="h-10 w-full bg-slate-300 rounded-[8px]"></div>
          <div className="h-5.5 w-64 bg-slate-300 rounded-[6px]"></div>
          <div className="h-5.5 w-48 bg-slate-300 rounded-[6px]"></div>
        </div>
      </div>

      {/* Tab Nav Skeleton */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-none">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div key={n} className="h-5 w-24 bg-slate-200 rounded-[6px] animate-pulse shrink-0"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-24 bg-white border border-slate-200 rounded-[12px] animate-pulse"></div>
              ))}
            </div>
            <div className="h-[280px] bg-white border border-slate-200 rounded-[12px] animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-white border border-slate-200 rounded-[12px] animate-pulse"></div>
            <div className="h-64 bg-white border border-slate-200 rounded-[12px] animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
