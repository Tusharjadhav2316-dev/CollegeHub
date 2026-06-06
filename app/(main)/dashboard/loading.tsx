import React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FF] animate-pulse">
      {/* Sidebar Skeleton (Desktop only) */}
      <div className="hidden lg:block w-[280px] bg-white border-r border-[#E2E8F0] h-screen p-6 space-y-8 shrink-0">
        <div className="h-9 w-32 bg-slate-200 rounded-xl" />
        <div className="space-y-4 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-11 w-full bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Skeleton */}
        <header className="h-[80px] bg-white border-b border-[#E2E8F0] px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="h-6 w-24 bg-slate-200 rounded-lg" />
          <div className="flex-1 max-w-[600px] mx-4">
            <div className="h-10 w-full bg-slate-100 rounded-full" />
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="h-9 w-9 bg-slate-200 rounded-full" />
            <div className="h-9 w-9 bg-slate-200 rounded-full" />
          </div>
        </header>

        {/* Scroll Content Skeleton */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto w-full">
          {/* Welcome skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-60 bg-slate-200 rounded-lg" />
              <div className="h-4 w-48 bg-slate-200 rounded-md" />
            </div>
            <div className="h-11 w-32 bg-slate-200 rounded-xl" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] h-[135px] flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                    <div className="h-7 w-12 bg-slate-200 rounded" />
                  </div>
                  <div className="h-9 w-9 bg-slate-200 rounded-xl" />
                </div>
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
            ))}
          </div>

          {/* Top Matches Skeleton */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-6 w-32 bg-slate-200 rounded-lg" />
              <div className="h-4 w-12 bg-slate-200 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 h-[160px] flex flex-col justify-between">
                  <div className="flex gap-4">
                    <div className="h-[80px] w-[80px] bg-slate-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4.5 w-16 bg-slate-200 rounded" />
                      <div className="h-5 w-3/4 bg-slate-200 rounded" />
                      <div className="h-4 w-1/2 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#F1F5F9] pt-4 mt-2">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                    <div className="h-8 w-24 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widgets Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] h-[360px] flex flex-col justify-between">
                <div className="h-5 w-40 bg-slate-200 rounded-lg" />
                <div className="flex-1 my-4 bg-slate-100/50 rounded-xl" />
                <div className="h-4 w-28 bg-slate-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
