"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Share2,
  RotateCcw,
  BarChart3,
  Loader2,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import CompareTable from "@/components/college/CompareTable";
import CompareSearch from "@/components/college/CompareSearch";
import { useCompareStore } from "@/lib/compare-store";
import { toast } from "react-hot-toast";

export default function CompareClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { compareList, clearCompare } = useCompareStore();

  const [colleges, setColleges] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const fetchedRef = useRef<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derive IDs: prefer URL params, fallback to store
  const getIds = useCallback(() => {
    const urlIds = searchParams.get("ids");
    if (urlIds) {
      return urlIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
    }
    return compareList.map((c) => c.id);
  }, [searchParams, compareList]);

  // Fetch colleges from API
  const fetchCompareData = useCallback(
    async (ids: string[]) => {
      const key = ids.sort().join(",");
      if (key === fetchedRef.current) return;
      fetchedRef.current = key;

      if (ids.length < 2) {
        setColleges([]);
        setHighlights(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/compare?ids=${ids.join(",")}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch");
        }
        const data = await res.json();
        setColleges(data.colleges);
        setHighlights(data.highlights);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setColleges([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Sync URL with store and fetch
  useEffect(() => {
    if (!mounted) return;
    const ids = getIds();

    // Update URL if IDs come from store but not in URL
    const urlIds = searchParams.get("ids");
    if (!urlIds && ids.length >= 2) {
      router.replace(`/compare?ids=${ids.join(",")}`, { scroll: false });
    }

    fetchCompareData(ids);
  }, [mounted, getIds, fetchCompareData, searchParams, router]);

  // Re-fetch when compareList changes (e.g. user adds from search)
  useEffect(() => {
    if (!mounted) return;
    const ids = compareList.map((c) => c.id);
    if (ids.length >= 2) {
      router.replace(`/compare?ids=${ids.join(",")}`, { scroll: false });
      fetchCompareData(ids);
    } else if (ids.length < 2 && colleges.length > 0) {
      fetchedRef.current = "";
      setColleges([]);
      setHighlights(null);
    }
  }, [mounted, compareList, router, fetchCompareData, colleges.length]);

  // Handlers
  const handlePrint = () => window.print();

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "College Comparison — CampusPilot",
          text: "Check out this college comparison on CampusPilot!",
          url,
        });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Copied compare link");
    }
  };

  const handleReset = () => {
    clearCompare();
    fetchedRef.current = "";
    setColleges([]);
    setHighlights(null);
    router.replace("/compare", { scroll: false });
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* ─── Page Header ─── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/discover"
              className="flex items-center gap-1.5 text-[13px] font-bold text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Discover
            </Link>
          </div>

          {/* Title + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-[26px] font-black text-slate-900 leading-tight">
                    Compare Colleges
                  </h1>
                  <p className="text-[13px] font-medium text-slate-500 mt-0.5">
                    {colleges.length > 0
                      ? `Comparing ${colleges.length} colleges side by side`
                      : "Add at least 2 colleges to start comparing"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {colleges.length >= 2 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] shadow-sm"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-all active:scale-[0.98]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Search: always visible to add more */}
          {compareList.length < 3 && (
            <div className="mt-6">
              <CompareSearch />
            </div>
          )}
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            <p className="text-[14px] font-semibold text-slate-500">
              Loading comparison data…
            </p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-14 w-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
            <p className="text-[15px] font-bold text-red-600">{error}</p>
            <button
              onClick={() => {
                fetchedRef.current = "";
                fetchCompareData(getIds());
              }}
              className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && colleges.length < 2 && (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center">
              <PlusCircle className="h-10 w-10 text-indigo-400" />
            </div>
            <div className="text-center space-y-2 max-w-sm">
              <h2 className="text-[20px] font-black text-slate-900">
                Not Enough Colleges
              </h2>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                You need at least 2 colleges to compare. Use the search above to
                add colleges, or browse the Discover page to find ones you like.
              </p>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              <BarChart3 className="h-4 w-4" />
              Browse Colleges
            </Link>
          </div>
        )}

        {/* Comparison Table */}
        {!isLoading && !error && colleges.length >= 2 && highlights && (
          <CompareTable colleges={colleges} highlights={highlights} />
        )}
      </div>
    </div>
  );
}
