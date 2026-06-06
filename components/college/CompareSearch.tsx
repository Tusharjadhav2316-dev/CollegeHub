"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Plus, Loader2 } from "lucide-react";
import { useCompareStore } from "@/lib/compare-store";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string;
  type: string;
  rating: number;
  annualFees: number;
  avgPackage: number;
  nirfRank: number | null;
  thumbnail: string;
}

export default function CompareSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { compareList, addCollege } = useCompareStore();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/colleges/search?q=${encodeURIComponent(q)}&limit=8`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.colleges || []);
        setIsOpen(true);
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleAdd = (college: SearchResult) => {
    const inList = compareList.some((c) => c.id === college.id);
    if (inList) return;

    const added = addCollege({
      id: college.id,
      name: college.name,
      slug: college.slug,
      thumbnail: college.thumbnail,
      city: college.city,
      state: college.state,
      rating: college.rating,
      annualFees: college.annualFees,
      avgPackage: college.avgPackage,
      nirfRank: college.nirfRank,
      type: college.type,
    });

    if (added) {
      setAddedId(college.id);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search and add a college…"
          className="w-full pl-10 pr-10 py-3 text-[14px] font-medium text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all shadow-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500 animate-spin" />
        )}
        {!isLoading && query && (
          <button
            onClick={clearQuery}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden max-h-[340px] overflow-y-auto">
          {results.map((college) => {
            const inList = compareList.some((c) => c.id === college.id);
            const justAdded = addedId === college.id;
            const listFull = compareList.length >= 3;

            return (
              <div
                key={college.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={college.thumbnail}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      college.name
                    )}&background=4F46E5&color=fff&size=80`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-slate-900 truncate">
                    {college.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {college.city ? `${college.city}, ` : ""}
                    {college.state} · {college.type}
                  </p>
                </div>
                <button
                  onClick={() => handleAdd(college)}
                  disabled={inList || listFull}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                    inList || justAdded
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                      : listFull
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.97]"
                  }`}
                >
                  {inList || justAdded ? (
                    "Added ✓"
                  ) : (
                    <>
                      <Plus className="h-3 w-3" />
                      Add
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {isOpen && !isLoading && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 px-4 py-6 text-center">
          <p className="text-[13px] font-semibold text-slate-500">
            No colleges found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
