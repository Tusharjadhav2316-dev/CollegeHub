"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Build page numbers
  const pages: (number | string)[] = [];
  const range = 2; // show 2 pages before and after

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - range && i <= currentPage + range)
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - range - 1 && i > 1) ||
      (i === currentPage + range + 1 && i < totalPages)
    ) {
      pages.push("...");
    }
  }

  // Remove duplicate consecutive ellipses
  const filteredPages = pages.filter((page, index) => {
    if (page === "...") {
      return pages[index - 1] !== "...";
    }
    return true;
  });

  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex items-center justify-center gap-1.5 py-6 mt-8 border-t border-[#E2E8F0]"
    >
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "h-9 w-9 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] bg-white transition-colors cursor-pointer",
          currentPage === 1
            ? "opacity-50 pointer-events-none text-slate-350"
            : "hover:bg-slate-50 active:scale-[0.97]"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {filteredPages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipse-${index}`}
              className="h-9 w-9 flex items-center justify-center text-slate-400 font-semibold text-sm select-none"
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={`page-${pageNum}`}
            onClick={() => handlePageChange(pageNum)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "h-9 w-9 rounded-lg text-sm font-bold flex items-center justify-center transition-all cursor-pointer",
              isActive
                ? "bg-[#4F46E5] text-white shadow-md shadow-indigo-500/10"
                : "bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-slate-50 active:scale-[0.97]"
            )}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "h-9 w-9 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] bg-white transition-colors cursor-pointer",
          currentPage === totalPages
            ? "opacity-50 pointer-events-none text-slate-350"
            : "hover:bg-slate-50 active:scale-[0.97]"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
