import React from "react";

export default function DiscoverLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-[#0F172A] animate-pulse">
      {/* 1. Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3.5 w-12 bg-slate-200 rounded" />
        <div className="h-3 w-3 bg-slate-200 rounded-full" />
        <div className="h-3.5 w-16 bg-slate-200 rounded" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-6 max-w-2xl">
        <div className="h-12 w-full bg-slate-200 rounded-lg" />
      </div>

      {/* 2. Header Block Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="h-8 w-64 bg-slate-200 rounded-md" />
          <div className="h-4 w-36 bg-slate-200 rounded-sm mt-2" />
        </div>
      </div>

      {/* 3. Controls Bar Skeleton */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-6 gap-4">
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-32 bg-slate-200 rounded-xl" />
          <div className="h-9 w-20 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* 4. Main Layout Grid Skeleton */}
      <div className="flex gap-6 items-start">
        {/* Sidebar Left Skeleton */}
        <aside className="hidden md:block w-[260px] shrink-0 space-y-6">
          <div className="border border-[#E2E8F0] bg-white rounded-2xl p-5 space-y-6">
            <div className="h-5 w-20 bg-slate-200 rounded" />
            <div className="space-y-3 pt-2">
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-5/6 bg-slate-200 rounded" />
              <div className="h-4 w-4/5 bg-slate-200 rounded" />
            </div>
            <hr className="border-slate-100" />
            <div className="h-5 w-24 bg-slate-200 rounded" />
            <div className="space-y-3 pt-2">
              <div className="h-10 w-full bg-slate-200 rounded-xl" />
              <div className="h-10 w-full bg-slate-200 rounded-xl" />
            </div>
          </div>
        </aside>

        {/* Results Grid Right Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm flex flex-col h-[380px]"
              >
                {/* Image Skeleton */}
                <div className="aspect-video w-full bg-slate-200" />
                {/* Content Skeleton */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-5 w-11/12 bg-slate-200 rounded" />
                    <div className="h-4 w-3/5 bg-slate-200 rounded" />
                  </div>
                  <div className="space-y-2.5 pt-4 border-t border-[#E2E8F0]">
                    <div className="flex justify-between">
                      <div className="h-4 w-16 bg-slate-200 rounded" />
                      <div className="h-4 w-20 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2 pt-4">
                    <div className="h-5 w-16 bg-slate-200 rounded" />
                    <div className="h-8 w-24 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
