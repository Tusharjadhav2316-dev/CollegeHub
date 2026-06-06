"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal, Search, ChevronRight } from "lucide-react";
import FilterPanel from "@/components/college/FilterPanel";
import CollegeCard from "@/components/college/CollegeCard";
import Pagination from "@/components/college/Pagination";
import CompareBar from "@/components/college/CompareBar";
import SearchBar from "@/components/college/SearchBar";
import { cn } from "@/lib/utils";

interface DiscoverClientProps {
  colleges: any[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export default function DiscoverClient({
  colleges,
  total,
  currentPage,
  totalPages,
  limit,
}: DiscoverClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Grid/List toggle: default is grid
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // Mobile filter drawer toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeStream = searchParams.get("stream") || "";
  const activeSort = searchParams.get("sort") || "relevance";

  const handleSortChange = (sortVal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortVal !== "relevance") {
      params.set("sort", sortVal);
    } else {
      params.delete("sort");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push(pathname);
    setMobileFilterOpen(false);
  };

  // Skip count
  const skip = (currentPage - 1) * limit;
  const showingFrom = total > 0 ? skip + 1 : 0;
  const showingTo = Math.min(skip + limit, total);

  // Breadcrumb category string
  const breadcrumbCategory = activeStream
    ? activeStream.charAt(0).toUpperCase() + activeStream.slice(1)
    : "All Colleges";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-[#0F172A]">
      
      {/* 1. BREADCRUMBS ROW */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] mb-4">
        <Link href="/" className="hover:text-[#4F46E5] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
        <Link href="/discover" className="hover:text-[#4F46E5] transition-colors">
          Discover
        </Link>
        {activeStream && (
          <>
            <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
            <span className="text-[#0F172A] font-bold">{breadcrumbCategory}</span>
          </>
        )}
      </nav>

      {/* Search Bar at the top of Discover content */}
      <div className="mb-6 max-w-2xl">
        <SearchBar defaultValue={searchParams.get("search") || ""} />
      </div>

      {/* 2. HEADER BLOCK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
            {activeStream
              ? `${breadcrumbCategory} Colleges in India`
              : "All Colleges in India"}
          </h1>
          <p className="text-xs font-bold text-[#64748B] mt-1.5 uppercase tracking-wider">
            {total.toLocaleString()} college records found
          </p>
        </div>

        {/* Mobile: Filter button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-extrabold text-[#64748B] hover:text-[#0F172A] active:scale-[0.98] transition-all cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#4F46E5]" />
          Filters
        </button>
      </div>

      {/* 3. CONTROLS BAR */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-6 gap-4">
        {/* Left: results showing indicator */}
        <p className="text-xs font-semibold text-[#64748B]">
          Showing <span className="font-bold text-[#0F172A]">{showingFrom}</span> -{" "}
          <span className="font-bold text-[#0F172A]">{showingTo}</span> of{" "}
          <span className="font-bold text-[#0F172A]">{total}</span> colleges
        </p>

        {/* Right: sorting & layout toggles */}
        <div className="flex items-center gap-3">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64748B] hidden sm:inline">Sort by:</span>
            <select
              value={activeSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-xs font-bold border border-[#E2E8F0] rounded-xl bg-white px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="fees: low to high">Fees: Low to High</option>
              <option value="fees: high to low">Fees: High to Low</option>
              <option value="rating: high to low">Rating: High to Low</option>
              <option value="placement: high to low">Placement: High to Low</option>
              <option value="ranking: best first">Ranking: Best First</option>
            </select>
          </div>

          {/* Grid/List View Toggles */}
          <div className="flex items-center border border-[#E2E8F0] rounded-xl p-0.5 bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer",
                viewMode === "grid"
                  ? "bg-[#4F46E5] text-white"
                  : "text-[#64748B] hover:text-[#0F172A]"
              )}
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer",
                viewMode === "list"
                  ? "bg-[#4F46E5] text-white"
                  : "text-[#64748B] hover:text-[#0F172A]"
              )}
              aria-label="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN LAYOUT GRID */}
      <div className="flex gap-6 items-start">
        {/* Sidebar Left: filter panel (sticky desktop only) */}
        <aside className="hidden md:block w-[260px] shrink-0 sticky top-20">
          <FilterPanel />
        </aside>

        {/* Results Grid Right */}
        <div className="flex-1 min-w-0">
          {colleges.length > 0 ? (
            <div>
              {viewMode === "grid" ? (
                /* Grid Layout */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {colleges.map((college) => (
                    <CollegeCard key={college.id} {...college} />
                  ))}
                </div>
              ) : (
                /* List Layout */
                <div className="flex flex-col gap-4">
                  {colleges.map((college) => (
                    <CollegeCard key={college.id} viewMode="list" {...college} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-[#E2E8F0] rounded-2xl text-center">
              <span className="text-4xl" role="img" aria-label="Search">🔍</span>
              <h3 className="text-lg font-extrabold text-[#0F172A] mt-4">
                No colleges found
              </h3>
              <p className="text-sm font-semibold text-[#64748B] mt-1 max-w-xs">
                Try adjusting your filters or searching a different term.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#3B32C5] text-white text-xs font-extrabold rounded-xl active:scale-[0.98] transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. COMPARE FLOATING FOOTER */}
      <CompareBar />

      {/* 6. MOBILE SLIDE-UP FILTER DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center md:hidden animate-fade-in">
          {/* Click outside backdrop to close */}
          <div className="absolute inset-0" onClick={() => setMobileFilterOpen(false)} />
          
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl p-5 overflow-hidden shadow-2xl flex flex-col z-10 animate-slide-up">
            {/* Grab handle */}
            <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto mb-4 shrink-0" />
            
            {/* Scrollable Filter Panel */}
            <div className="overflow-y-auto flex-1 pb-4">
              <FilterPanel onApplyMobile={() => setMobileFilterOpen(false)} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
