"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, ChevronUp, X, Star } from "lucide-react";
import { formatFees, cn } from "@/lib/utils";

interface FilterPanelProps {
  onApplyMobile?: () => void;
}

const COURSES_STREAMS = [
  "Engineering",
  "MBA",
  "Medical",
  "Design",
  "Law",
  "Arts",
  "Science",
  "Commerce",
];

const ENTRANCE_EXAMS = ["JEE Advanced", "JEE Mains", "NEET", "CAT", "GATE", "GMAT", "XAT"];
const COLLEGE_TYPES = ["Government", "Private", "Deemed", "Autonomous"];
const ACCREDITATIONS = ["NAAC A++", "NAAC A+", "NAAC A", "NBA"];

export default function FilterPanel({ onApplyMobile }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Collapsible sections state
  const [collapsed, setCollapsed] = useState({
    location: false,
    stream: false,
    fees: false,
    ranking: false,
    exams: false,
    type: false,
    rating: false,
    accreditation: false,
  });

  // Dynamic States from database
  const [states, setStates] = useState<string[]>([]);
  const [showAllStates, setShowAllStates] = useState(false);

  useEffect(() => {
    fetch("/api/states")
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error("Error fetching states:", err));
  }, []);

  const toggleSection = (section: keyof typeof collapsed) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper to parse query parameters
  const getParamArray = (key: string): string[] => {
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  };

  const selectedStates = getParamArray("state");
  const selectedStreams = getParamArray("stream");
  const selectedExams = getParamArray("exams");
  const selectedTypes = getParamArray("type");
  const selectedAccreditations = getParamArray("accreditation");

  const selectedMinFees = parseInt(searchParams.get("minFees") || "0");
  const selectedMaxFees = parseInt(searchParams.get("maxFees") || "500000");
  const selectedRanking = parseInt(searchParams.get("nirfRank") || "100");
  const selectedRating = parseInt(searchParams.get("minRating") || "0");

  // Helper to update a URL parameter
  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset pagination on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  // Multi-select toggle helpers
  const handleToggleArray = (key: string, currentList: string[], item: string) => {
    const isSelected = currentList.includes(item);
    const updated = isSelected
      ? currentList.filter((x) => x !== item)
      : [...currentList, item];
    
    updateParam(key, updated.length > 0 ? updated.join(",") : null);
  };

  const handleResetAll = () => {
    router.push(pathname);
    if (onApplyMobile) onApplyMobile();
  };

  // Calculations for selection count badges
  const stateCount = selectedStates.length;
  const streamCount = selectedStreams.length;
  const feesCount = (selectedMinFees > 0 || selectedMaxFees < 500000) ? 1 : 0;
  const rankingCount = selectedRanking < 100 ? 1 : 0;
  const examsCount = selectedExams.length;
  const typeCount = selectedTypes.length;
  const ratingCount = selectedRating > 0 ? 1 : 0;
  const accCount = selectedAccreditations.length;

  const statesToShow = showAllStates ? states : states.slice(0, 5);

  // Active Pills Generation
  const activePills: { label: string; onRemove: () => void }[] = [];

  selectedStates.forEach((st) => {
    activePills.push({
      label: st,
      onRemove: () => handleToggleArray("state", selectedStates, st),
    });
  });

  selectedStreams.forEach((str) => {
    activePills.push({
      label: str,
      onRemove: () => handleToggleArray("stream", selectedStreams, str),
    });
  });

  selectedExams.forEach((ex) => {
    activePills.push({
      label: ex,
      onRemove: () => handleToggleArray("exams", selectedExams, ex),
    });
  });

  selectedTypes.forEach((t) => {
    activePills.push({
      label: t,
      onRemove: () => handleToggleArray("type", selectedTypes, t),
    });
  });

  selectedAccreditations.forEach((acc) => {
    activePills.push({
      label: acc,
      onRemove: () => handleToggleArray("accreditation", selectedAccreditations, acc),
    });
  });

  if (selectedMinFees > 0 || selectedMaxFees < 500000) {
    activePills.push({
      label: `Fees: ${formatFees(selectedMinFees)} - ${formatFees(selectedMaxFees)}`,
      onRemove: () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("minFees");
        params.delete("maxFees");
        router.push(`${pathname}?${params.toString()}`);
      },
    });
  }

  if (selectedRanking < 100) {
    activePills.push({
      label: `NIRF: Top ${selectedRanking}`,
      onRemove: () => updateParam("nirfRank", null),
    });
  }

  if (selectedRating > 0) {
    activePills.push({
      label: `Rating: ${selectedRating}+ ★`,
      onRemove: () => updateParam("minRating", null),
    });
  }

  return (
    <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col gap-5 h-fit text-[#0F172A]">
      
      {/* Custom Styles for overlay dual sliders */}
      <style jsx global>{`
        .range-slider-input::-webkit-slider-thumb {
          pointer-events: auto !important;
        }
        .range-slider-input::-moz-range-thumb {
          pointer-events: auto !important;
        }
      `}</style>

      {/* Header Block with Active Pills */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 shrink-0">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
          Advanced Filters
        </h3>
        {activePills.length > 0 && (
          <button
            onClick={handleResetAll}
            className="text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filter Pills List */}
      {activePills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-2">
          {activePills.map((pill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-xs font-bold text-[#4F46E5] px-2.5 py-1 rounded-full"
            >
              {pill.label}
              <button
                type="button"
                onClick={pill.onRemove}
                className="hover:text-indigo-900 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* SCROLLABLE FORM SEGMENTS */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-1 scrollbar-thin">
        
        {/* Section 1: Location */}
        <div className="border-b border-[#E2E8F0] pb-4">
          <button
            onClick={() => toggleSection("location")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#64748B] mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              Location
              {stateCount > 0 && (
                <span className="h-4.5 min-w-4.5 px-1 bg-indigo-150 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-extrabold text-[#4F46E5] flex items-center justify-center">
                  {stateCount}
                </span>
              )}
            </span>
            {collapsed.location ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          
          {!collapsed.location && (
            <div className="space-y-2 pt-1">
              {statesToShow.map((stateName) => {
                const checked = selectedStates.includes(stateName);
                return (
                  <label
                    key={stateName}
                    className="flex items-center gap-2.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleArray("state", selectedStates, stateName)}
                      className="h-4 w-4 rounded border-[#E2E8F0] text-[#4F46E5] focus:ring-[#4F46E5]/20 cursor-pointer"
                    />
                    {stateName}
                  </label>
                );
              })}
              
              {states.length > 5 && (
                <button
                  onClick={() => setShowAllStates(!showAllStates)}
                  className="text-xs font-bold text-[#4F46E5] hover:underline mt-1 cursor-pointer block"
                >
                  {showAllStates ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Course & Stream */}
        <div className="border-b border-[#E2E8F0] pb-4">
          <button
            onClick={() => toggleSection("stream")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#64748B] mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              Stream / Course
              {streamCount > 0 && (
                <span className="h-4.5 min-w-4.5 px-1 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-extrabold text-[#4F46E5] flex items-center justify-center">
                  {streamCount}
                </span>
              )}
            </span>
            {collapsed.stream ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          
          {!collapsed.stream && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COURSES_STREAMS.map((s) => {
                const checked = selectedStreams.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleToggleArray("stream", selectedStreams, s)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer",
                      checked
                        ? "bg-[#4F46E5] border-[#4F46E5] text-white"
                        : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#64748B]"
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Fees Range */}
        <div className="border-b border-[#E2E8F0] pb-4">
          <button
            onClick={() => toggleSection("fees")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#64748B] mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              Annual Fees Range
              {feesCount > 0 && (
                <span className="h-4.5 min-w-4.5 px-1 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-extrabold text-[#4F46E5] flex items-center justify-center">
                  {feesCount}
                </span>
              )}
            </span>
            {collapsed.fees ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          {!collapsed.fees && (
            <div className="pt-2 px-1">
              {/* Dual Range Track */}
              <div className="relative h-6">
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={selectedMinFees}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), selectedMaxFees - 10000);
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("minFees", val.toString());
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className="range-slider-input absolute w-full h-1 appearance-none bg-transparent pointer-events-none z-30 outline-none top-2"
                  style={{ WebkitAppearance: "none" }}
                />
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={selectedMaxFees}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), selectedMinFees + 10000);
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("maxFees", val.toString());
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className="range-slider-input absolute w-full h-1 appearance-none bg-transparent pointer-events-none z-30 outline-none top-2"
                  style={{ WebkitAppearance: "none" }}
                />
                
                {/* Background Line */}
                <div className="absolute top-2 left-0 right-0 h-1.5 bg-slate-100 rounded-full" />
                {/* Visual active range slider fill */}
                <div
                  className="absolute top-2 h-1.5 bg-[#4F46E5] rounded-full"
                  style={{
                    left: `${(selectedMinFees / 500000) * 100}%`,
                    right: `${100 - (selectedMaxFees / 500000) * 100}%`,
                  }}
                />
              </div>

              {/* Labels display */}
              <div className="flex items-center justify-between text-xs font-bold text-[#64748B] mt-1.5">
                <span>{formatFees(selectedMinFees)}</span>
                <span>{formatFees(selectedMaxFees)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Ranking Range */}
        <div className="border-b border-[#E2E8F0] pb-4">
          <button
            onClick={() => toggleSection("ranking")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#64748B] mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              NIRF Ranking
              {rankingCount > 0 && (
                <span className="h-4.5 min-w-4.5 px-1 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-extrabold text-[#4F46E5] flex items-center justify-center">
                  {rankingCount}
                </span>
              )}
            </span>
            {collapsed.ranking ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          {!collapsed.ranking && (
            <div className="pt-2 px-1">
              <input
                type="range"
                min="1"
                max="100"
                value={selectedRanking}
                onChange={(e) => updateParam("nirfRank", e.target.value)}
                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-[#4F46E5] outline-none"
              />
              <p className="text-xs font-bold text-[#64748B] mt-2">
                Top {selectedRanking} Colleges
              </p>
            </div>
          )}
        </div>

        {/* Section 5: Entrance Exams */}
        <div className="border-b border-[#E2E8F0] pb-4">
          <button
            onClick={() => toggleSection("exams")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#64748B] mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              Entrance Exams
              {examsCount > 0 && (
                <span className="h-4.5 min-w-4.5 px-1 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-extrabold text-[#4F46E5] flex items-center justify-center">
                  {examsCount}
                </span>
              )}
            </span>
            {collapsed.exams ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          {!collapsed.exams && (
            <div className="space-y-2 pt-1">
              {ENTRANCE_EXAMS.map((exam) => {
                const checked = selectedExams.includes(exam);
                return (
                  <label
                    key={exam}
                    className="flex items-center gap-2.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleArray("exams", selectedExams, exam)}
                      className="h-4 w-4 rounded border-[#E2E8F0] text-[#4F46E5] focus:ring-[#4F46E5]/20 cursor-pointer"
                    />
                    {exam}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 6: College Type */}
        <div className="border-b border-[#E2E8F0] pb-4">
          <button
            onClick={() => toggleSection("type")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#64748B] mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              College Type
              {typeCount > 0 && (
                <span className="h-4.5 min-w-4.5 px-1 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-extrabold text-[#4F46E5] flex items-center justify-center">
                  {typeCount}
                </span>
              )}
            </span>
            {collapsed.type ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          {!collapsed.type && (
            <div className="space-y-2 pt-1">
              {COLLEGE_TYPES.map((t) => {
                const checked = selectedTypes.includes(t);
                return (
                  <label
                    key={t}
                    className="flex items-center gap-2.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleArray("type", selectedTypes, t)}
                      className="h-4 w-4 rounded border-[#E2E8F0] text-[#4F46E5] focus:ring-[#4F46E5]/20 cursor-pointer"
                    />
                    {t}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 7: Minimum Rating */}
        <div className="border-b border-[#E2E8F0] pb-4">
          <button
            onClick={() => toggleSection("rating")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#64748B] mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              Minimum Rating
              {ratingCount > 0 && (
                <span className="h-4.5 min-w-4.5 px-1 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-extrabold text-[#4F46E5] flex items-center justify-center">
                  {ratingCount}
                </span>
              )}
            </span>
            {collapsed.rating ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          {!collapsed.rating && (
            <div className="flex items-center gap-1 pt-1.5 select-none">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isSelected = selectedRating >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => {
                      const nextRating = selectedRating === starVal ? 0 : starVal;
                      updateParam("minRating", nextRating > 0 ? nextRating.toString() : null);
                    }}
                    className="cursor-pointer"
                    aria-label={`Filter by minimum rating of ${starVal} stars`}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isSelected ? "fill-[#F59E0B] text-[#F59E0B]" : "text-slate-300"
                      )}
                    />
                  </button>
                );
              })}
              {selectedRating > 0 && (
                <span className="text-xs font-bold text-[#64748B] ml-2">
                  {selectedRating}+ Stars
                </span>
              )}
            </div>
          )}
        </div>

        {/* Section 8: Accreditation */}
        <div className="border-b-0">
          <button
            onClick={() => toggleSection("accreditation")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#64748B] mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              Accreditations
              {accCount > 0 && (
                <span className="h-4.5 min-w-4.5 px-1 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-extrabold text-[#4F46E5] flex items-center justify-center">
                  {accCount}
                </span>
              )}
            </span>
            {collapsed.accreditation ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          {!collapsed.accreditation && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ACCREDITATIONS.map((acc) => {
                const checked = selectedAccreditations.includes(acc);
                return (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => handleToggleArray("accreditation", selectedAccreditations, acc)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer",
                      checked
                        ? "bg-[#4F46E5] border-[#4F46E5] text-white"
                        : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#64748B]"
                    )}
                  >
                    {acc}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Buttons at Bottom */}
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#E2E8F0] shrink-0">
        <button
          onClick={handleResetAll}
          className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors uppercase tracking-wider cursor-pointer"
        >
          Reset All
        </button>

        {onApplyMobile && (
          <button
            onClick={onApplyMobile}
            className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors uppercase tracking-wider cursor-pointer md:hidden"
          >
            Apply Filters
          </button>
        )}
      </div>

    </div>
  );
}
