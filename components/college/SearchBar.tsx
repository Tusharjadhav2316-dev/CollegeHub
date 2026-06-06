"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Clock, TrendingUp, Award, MapPin, BookOpen, Star, Sliders } from "lucide-react";
import { cn, formatFees } from "@/lib/utils";

export interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface CollegeSuggestion {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  nirfRank: number | null;
  thumbnail: string;
  annualFees: number;
}

interface CourseSuggestion {
  id: string;
  name: string;
  collegeId: string;
  collegeName: string;
}

interface SearchResponse {
  colleges: CollegeSuggestion[];
  courses: CourseSuggestion[];
  cities: string[];
  exams: string[];
  trending: CollegeSuggestion[];
}

function getAcronym(name: string): string {
  const cleaned = name
    .replace("Indian Institute of Technology", "IIT")
    .replace("Indian Institute of Management", "IIM")
    .replace("National Institute of Technology", "NIT");
  
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 3) {
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
  }
  if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0] ? words[0].slice(0, 3).toUpperCase() : "COL";
}

function getAcronymBg(acronym: string): string {
  const code = (acronym.charCodeAt(0) || 0) + (acronym.charCodeAt(1) || 0);
  const colors = [
    "bg-red-50 text-red-600 border-red-100",
    "bg-blue-50 text-blue-600 border-blue-100",
    "bg-emerald-50 text-emerald-600 border-emerald-100",
    "bg-amber-50 text-amber-600 border-amber-100",
    "bg-indigo-50 text-indigo-600 border-indigo-100",
    "bg-purple-50 text-purple-600 border-purple-100",
    "bg-rose-50 text-rose-600 border-rose-100",
  ];
  return colors[code % colors.length];
}

export default function SearchBar({
  defaultValue = "",
  placeholder = "Search colleges, courses, cities...",
  className,
  size = "md",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [data, setData] = useState<SearchResponse>({
    colleges: [],
    courses: [],
    cities: [],
    exams: [],
    trending: [],
  });

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("campuspilot-recent-searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  // Save search query to history
  const saveSearchQuery = (q: string) => {
    if (!q.trim()) return;
    const trimmed = q.trim();
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("campuspilot-recent-searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save search history", e);
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
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    setIsLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch autocomplete suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  // Size styling maps
  const heightClass = size === "lg" ? "h-14" : size === "sm" ? "h-10" : "h-12";
  const paddingClass = size === "lg" ? "pl-12 pr-24 text-base" : "pl-10 pr-20 text-sm";
  const searchIconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    saveSearchQuery(trimmed);
    setIsExpanded(false);
    router.push(`/discover?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectCollege = (slug: string, name: string) => {
    saveSearchQuery(name);
    setIsExpanded(false);
    router.push(`/colleges/${slug}`);
  };

  const handleSelectCity = (city: string) => {
    saveSearchQuery(city);
    setIsExpanded(false);
    router.push(`/discover?state=${encodeURIComponent(city)}`);
  };

  const handleSelectCourse = (courseName: string) => {
    saveSearchQuery(courseName);
    setIsExpanded(false);
    router.push(`/discover?stream=${encodeURIComponent(courseName)}`);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems =
      data.colleges.length +
      data.courses.length +
      data.cities.length +
      data.exams.length +
      (query.trim() ? 0 : recentSearches.length);

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
        // Find selected item in flattened index list
        let idx = 0;
        
        // Colleges
        if (activeIndex < idx + data.colleges.length) {
          const col = data.colleges[activeIndex - idx];
          handleSelectCollege(col.slug, col.name);
          return;
        }
        idx += data.colleges.length;

        // Courses
        if (activeIndex < idx + data.courses.length) {
          const crs = data.courses[activeIndex - idx];
          handleSelectCourse(crs.name);
          return;
        }
        idx += data.courses.length;

        // Cities
        if (activeIndex < idx + data.cities.length) {
          const city = data.cities[activeIndex - idx];
          handleSelectCity(city);
          return;
        }
        idx += data.cities.length;

        // Exams
        if (activeIndex < idx + data.exams.length) {
          const exam = data.exams[activeIndex - idx];
          handleSearchSubmit();
          return;
        }
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };

  // Top Matching college preview card (on the right)
  const topCollege = data.colleges[0] || null;
  const mockSeats = topCollege ? Math.floor(((topCollege.name.charCodeAt(0) + topCollege.name.charCodeAt(1)) * 3) % 200) + 120 : 0;
  const mockPlacementRate = topCollege ? Math.floor(((topCollege.name.charCodeAt(2) || 80) * 5) % 15) + 85 : 0;

  return (
    <div ref={containerRef} className={cn("relative w-full z-45", className)}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        {/* Search Icon */}
        <Search className={cn("absolute left-3.5 text-slate-400 pointer-events-none", searchIconSize)} />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsExpanded(true);
            setActiveIndex(-1);
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
          aria-controls="search-suggestions-container"
          className={cn(
            "w-full rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#4F46E5] transition-all",
            heightClass,
            paddingClass
          )}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Expanded Suggestions Dropdown */}
      {isExpanded && (
        <div
          id="search-suggestions-container"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E2E8F0] shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row z-50 divide-y md:divide-y-0 md:divide-x divide-slate-100"
        >
          {/* SKELETON LOADER */}
          {isLoading && (
            <div className="w-full md:w-3/5 p-4 space-y-3.5 animate-pulse">
              <div className="h-3.5 w-16 bg-slate-100 rounded mb-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-2/3 bg-slate-100 rounded" />
                    <div className="h-2.5 w-1/3 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LEFT PANEL: Lists */}
          {!isLoading && (
            <div className="w-full md:flex-1 p-4 max-h-[420px] overflow-y-auto space-y-4">
              
              {/* 1. COLLEGES SECTION */}
              {data.colleges.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider">
                    Colleges
                  </h4>
                  <div className="space-y-0.5">
                    {data.colleges.map((col, idx) => {
                      const acronym = getAcronym(col.name);
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => handleSelectCollege(col.slug, col.name)}
                          className={cn(
                            "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer",
                            activeIndex === idx
                              ? "bg-slate-50 text-[#4F46E5]"
                              : "hover:bg-slate-50/50"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border border-transparent",
                                getAcronymBg(acronym)
                              )}
                            >
                              {acronym}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#0F172A] truncate">
                                {col.name}
                              </p>
                              <p className="text-[10px] font-semibold text-[#64748B] truncate">
                                {col.location}
                              </p>
                            </div>
                          </div>
                          {col.nirfRank && col.nirfRank <= 100 && (
                            <span className="text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/50 px-2 py-0.5 rounded-full shrink-0">
                              #{col.nirfRank} NIRF
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. COURSES SECTION */}
              {data.courses.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider">
                    Courses
                  </h4>
                  <div className="space-y-0.5">
                    {data.courses.map((course, idx) => {
                      const activeOffset = data.colleges.length + idx;
                      return (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => handleSelectCourse(course.name)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold transition-colors cursor-pointer",
                            activeIndex === activeOffset
                              ? "bg-slate-50 text-[#4F46E5]"
                              : "text-slate-600 hover:bg-slate-50/50"
                          )}
                        >
                          <BookOpen className="h-4 w-4 text-[#4F46E5] shrink-0" />
                          <span className="truncate">
                            {course.name} <span className="text-[10px] text-slate-400">({course.collegeName})</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. CITIES SECTION */}
              {data.cities.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider">
                    Cities
                  </h4>
                  <div className="space-y-0.5">
                    {data.cities.map((city, idx) => {
                      const activeOffset = data.colleges.length + data.courses.length + idx;
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleSelectCity(city)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold transition-colors cursor-pointer",
                            activeIndex === activeOffset
                              ? "bg-slate-50 text-[#4F46E5]"
                              : "text-slate-600 hover:bg-slate-50/50"
                          )}
                        >
                          <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span className="truncate">{city}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. EXAMS SECTION */}
              {data.exams.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider">
                    Exams
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {data.exams.map((exam, idx) => {
                      const activeOffset =
                        data.colleges.length + data.courses.length + data.cities.length + idx;
                      return (
                        <button
                          key={exam}
                          type="button"
                          onClick={() => {
                            setQuery(exam);
                            saveSearchQuery(exam);
                            setIsExpanded(false);
                            router.push(`/discover?search=${encodeURIComponent(exam)}`);
                          }}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer",
                            activeIndex === activeOffset
                              ? "bg-[#4F46E5] border-[#4F46E5] text-white"
                              : "bg-white border-[#E2E8F0] text-slate-655 text-slate-600 hover:border-[#64748B]"
                          )}
                        >
                          <Award className="h-3 w-3 text-amber-500 shrink-0" />
                          {exam}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. RECENT SEARCHES (Only when query is empty) */}
              {!query.trim() && recentSearches.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider">
                    Recent Searches
                  </h4>
                  <div className="space-y-0.5">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          saveSearchQuery(term);
                          setIsExpanded(false);
                          router.push(`/discover?search=${encodeURIComponent(term)}`);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-600 hover:bg-slate-50/50 cursor-pointer"
                      >
                        <Clock className="h-3.5 w-3.5 text-[#94A3B8] shrink-0" />
                        <span className="truncate">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. TRENDING SECTIONS */}
              {!query.trim() && data.trending.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider">
                    Trending
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {data.trending.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => handleSelectCollege(col.slug, col.name)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-slate-50 border border-slate-100 hover:border-[#E2E8F0] text-slate-600 hover:text-[#0F172A] transition-colors cursor-pointer"
                      >
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0 mr-0.5" />
                        {col.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* RIGHT PANEL: Live College Preview Card */}
          {topCollege && !isLoading && (
            <div className="hidden md:flex flex-col w-[260px] p-4 bg-slate-50/50 justify-between shrink-0">
              <div className="space-y-3">
                {/* Visual Label */}
                <span className="text-[9px] font-extrabold uppercase bg-indigo-50 border border-indigo-100 text-[#4F46E5] px-2 py-0.5 rounded-full w-fit block">
                  Top Match
                </span>
                
                {/* College Image */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-[#E2E8F0]">
                  <Image
                    src={topCollege.thumbnail}
                    alt={topCollege.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>

                {/* Details */}
                <div>
                  <h5 className="text-xs font-extrabold text-[#0F172A] line-clamp-2 leading-snug">
                    {topCollege.name}
                  </h5>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-[11px] font-bold text-[#0F172A]">
                      4.9
                    </span>
                    <span className="text-[9px] text-[#94A3B8] font-semibold">
                      ({mockSeats * 11} Reviews)
                    </span>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-2 border-t border-[#E2E8F0] pt-2">
                  <div>
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase block">Fees</span>
                    <span className="text-xs font-bold text-[#0F172A]">{formatFees(topCollege.annualFees)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase block">Placements</span>
                    <span className="text-xs font-bold text-[#16A34A]">{mockPlacementRate}%</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectCollege(topCollege.slug, topCollege.name)}
                className="w-full mt-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-extrabold rounded-xl text-center active:scale-[0.98] transition-all cursor-pointer"
              >
                View Full Profile
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
