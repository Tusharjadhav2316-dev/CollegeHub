"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp, Award, MapPin, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  onSearch?: (query: string) => void;
}

interface CollegeSuggestion {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string;
  thumbnail: string;
  type: string;
  rating: number;
}

const TRENDING_COLLEGES = [
  { name: "IIT Bombay", slug: "indian-institute-of-technology-bombay", city: "Mumbai", state: "Maharashtra" },
  { name: "IIT Delhi", slug: "indian-institute-of-technology-delhi", city: "New Delhi", state: "Delhi" },
  { name: "IIT Madras", slug: "indian-institute-of-technology-madras", city: "Chennai", state: "Tamil Nadu" },
];

const POPULAR_EXAMS = ["JEE Advanced", "JEE Mains", "NEET", "CAT"];
const POPULAR_CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai"];
const POPULAR_COURSES = ["B.Tech", "MBA", "MBBS", "B.Des"];

export default function SearchBar({
  defaultValue = "",
  placeholder = "Search colleges, courses, cities...",
  className,
  size = "md",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState<CollegeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("campus_pilot_recent_searches");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Defer setting state to prevent synchronous setState inside useEffect
        setTimeout(() => {
          setRecentSearches(parsed);
        }, 0);
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const trimmed = searchQuery.trim();
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("campus_pilot_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save recent searches", e);
    }
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem("campus_pilot_recent_searches");
    } catch (e) {
      console.error("Failed to clear recent searches", e);
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/colleges/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.colleges || []);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  // Size styling maps
  const sizeStyles = {
    sm: {
      wrapper: "h-10",
      input: "pl-10 pr-20 text-sm",
      icon: "h-4 w-4 left-3.5",
      btn: "right-1 text-xs px-3 py-1.5 rounded-lg",
      clearBtn: "right-24",
    },
    md: {
      wrapper: "h-12",
      input: "pl-12 pr-24 text-sm",
      icon: "h-5 w-5 left-4",
      btn: "right-1.5 text-xs px-4 py-2 rounded-xl",
      clearBtn: "right-28",
    },
    lg: {
      wrapper: "h-14",
      input: "pl-14 pr-28 text-base",
      icon: "h-5.5 w-5.5 left-5",
      btn: "right-1.5 text-sm px-5 py-3 rounded-xl",
      clearBtn: "right-32",
    },
  };

  const s = sizeStyles[size];

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    saveRecentSearch(trimmed);
    setIsExpanded(false);
    
    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(`/discover?search=${encodeURIComponent(trimmed)}`);
    }
  }

  // Handle keyboard selections
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Total items in dropdown for active list
    const hasQuery = query.trim().length >= 2;
    const totalItems = hasQuery ? results.length : (recentSearches.length + TRENDING_COLLEGES.length + POPULAR_EXAMS.length);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsExpanded(true);
      setActiveIndex((prev) => (prev + 1 >= totalItems ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsExpanded(true);
      setActiveIndex((prev) => (prev - 1 < 0 ? totalItems - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        if (hasQuery) {
          const selected = results[activeIndex];
          if (selected) {
            saveRecentSearch(selected.name);
            setIsExpanded(false);
            router.push(`/colleges/${selected.slug}`);
          }
        } else {
          // Decipher index of active item in static layout
          let currentIndex = 0;
          
          // Check recent
          if (activeIndex < recentSearches.length) {
            const term = recentSearches[activeIndex];
            setQuery(term);
            saveRecentSearch(term);
            setIsExpanded(false);
            router.push(`/discover?search=${encodeURIComponent(term)}`);
            return;
          }
          currentIndex += recentSearches.length;

          // Check trending colleges
          if (activeIndex < currentIndex + TRENDING_COLLEGES.length) {
            const col = TRENDING_COLLEGES[activeIndex - currentIndex];
            saveRecentSearch(col.name);
            setIsExpanded(false);
            router.push(`/colleges/${col.slug}`);
            return;
          }
          currentIndex += TRENDING_COLLEGES.length;

          // Check exams
          if (activeIndex < currentIndex + POPULAR_EXAMS.length) {
            const exam = POPULAR_EXAMS[activeIndex - currentIndex];
            saveRecentSearch(exam);
            setIsExpanded(false);
            router.push(`/discover?search=${encodeURIComponent(exam)}`);
            return;
          }
        }
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      setIsExpanded(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  }

  function handleSelectSuggestion(col: { name: string; slug: string }) {
    saveRecentSearch(col.name);
    setIsExpanded(false);
    router.push(`/colleges/${col.slug}`);
  }

  function handleSelectTerm(term: string) {
    setQuery(term);
    saveRecentSearch(term);
    setIsExpanded(false);
    router.push(`/discover?search=${encodeURIComponent(term)}`);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-2xl mx-auto z-40", className)}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Search Icon */}
        <Search
          className={cn(
            "pointer-events-none absolute text-slate-400 dark:text-slate-500",
            s.icon
          )}
          aria-hidden="true"
        />

        {/* Search Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setIsExpanded(true);
            setActiveIndex(-1);
            if (val.trim().length < 2) {
              setResults([]);
              setIsLoading(false);
            } else {
              setIsLoading(true);
            }
          }}
          onFocus={() => {
            setIsExpanded(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={isExpanded}
          aria-controls="search-suggestions-dropdown"
          className={cn(
            "w-full",
            s.wrapper,
            s.input,
            "rounded-2xl border border-slate-200 dark:border-slate-800",
            "bg-white dark:bg-slate-900/90 dark:backdrop-blur-md",
            "text-slate-900 dark:text-slate-100 font-medium",
            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
            "shadow-md hover:shadow-lg focus:shadow-xl focus:border-indigo-500 dark:focus:border-indigo-500",
            "focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5",
            "transition-all duration-200"
          )}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            className={cn(
              "absolute p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors",
              s.clearBtn
            )}
            aria-label="Clear search text"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Submit Search Button */}
        <button
          type="submit"
          className={cn(
            "absolute font-bold text-white",
            "bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600",
            "shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.97]",
            "transition-all duration-200",
            s.btn
          )}
        >
          Search
        </button>
      </form>

      {/* Expanded Dropdown State Panel */}
      {isExpanded && (
        <div id="search-suggestions-dropdown" className="absolute top-full left-0 right-0 mt-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-lg z-50">
          {/* SKELETON / LOADING STATUS */}
          {isLoading && (
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <span className="text-xs font-semibold text-slate-500">Fetching matches...</span>
            </div>
          )}

          {/* DYNAMIC RESULTS BLOCK */}
          {query.trim().length >= 2 ? (
            <div className="p-2 max-h-96 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Colleges Matching &quot;{query}&quot;
              </div>
              {results.length > 0 ? (
                <div className="space-y-0.5">
                  {results.map((col, idx) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(col)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                        activeIndex === idx
                          ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      )}
                    >
                      {/* Image Thumbnail */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={col.thumbnail}
                        alt=""
                        className="h-9 w-9 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(col.name)}&background=4F46E5&color=fff&size=80`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {col.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>{col.city ? `${col.city}, ${col.state}` : col.state}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                          <span className="font-medium">{col.type}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">No colleges matched your search term.</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try searching a different city, course or name.</p>
                </div>
              )}
            </div>
          ) : (
            /* DEFAULT / STATIC EXPANDED BLOCK */
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
              
              {/* Left Column: Recent + Trending */}
              <div className="p-4 space-y-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Searches</span>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-0.5">
                      {recentSearches.map((term, idx) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSelectTerm(term)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold transition-colors",
                            activeIndex === idx
                              ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                          )}
                        >
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Colleges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trending Colleges</span>
                  <div className="space-y-0.5">
                    {TRENDING_COLLEGES.map((col, idx) => {
                      const computedIdx = recentSearches.length + idx;
                      return (
                        <button
                          key={col.slug}
                          type="button"
                          onClick={() => handleSelectSuggestion(col)}
                          className={cn(
                            "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors",
                            activeIndex === computedIdx
                              ? "bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                          )}
                        >
                          <div className="min-w-0 flex items-center gap-2">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{col.name}</span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">{col.city}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Exams + Quick Pills */}
              <div className="p-4 space-y-4">
                {/* Exams */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Popular Exams</span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_EXAMS.map((exam, idx) => {
                      const computedIdx = recentSearches.length + TRENDING_COLLEGES.length + idx;
                      return (
                        <button
                          key={exam}
                          type="button"
                          onClick={() => handleSelectTerm(exam)}
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer",
                            activeIndex === computedIdx
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                          )}
                        >
                          <Award className="h-3 w-3 text-amber-500 shrink-0" />
                          {exam}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Popular Cities */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Popular Cities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_CITIES.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleSelectTerm(city)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Courses */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Popular Courses</span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_COURSES.map((course) => (
                      <button
                        key={course}
                        type="button"
                        onClick={() => handleSelectTerm(course)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        <BookOpen className="h-3 w-3 text-indigo-500 shrink-0" />
                        {course}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Instruction Strip */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex items-center justify-between text-[10px] font-medium text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Real live campus records
            </span>
            <span>Press Enter to Search</span>
          </div>
        </div>
      )}
    </div>
  );
}
