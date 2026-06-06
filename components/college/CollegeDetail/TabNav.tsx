"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface TabNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "Courses and Fees" },
  { id: "placements", label: "Placements" },
  { id: "admissions", label: "Admissions" },
  { id: "cutoffs", label: "Cutoffs" },
  { id: "reviews", label: "Reviews" },
  { id: "gallery", label: "Gallery" },
];

export default function TabNav({ activeTab, setActiveTab }: TabNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById("college-tab-content");
    if (element) {
      const yOffset = -120; // 64px navbar + sticky tabnav + safety margin
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-[64px] bg-white border-b border-slate-200 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={containerRef}
          className="flex overflow-x-auto -mb-px space-x-8 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "whitespace-nowrap py-4 px-1 border-b-2 text-[14px] font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "border-[#4F46E5] text-[#4F46E5]"
                    : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-slate-300"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
