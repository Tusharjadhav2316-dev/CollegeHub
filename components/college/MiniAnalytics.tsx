import React from "react";
import { TrendingUp, Award, BarChart3, PieChart } from "lucide-react";

export default function MiniAnalytics() {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Admission &amp; Placement Trends
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Chart 1: Radial / Pie Chart - Admission Probability */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-3">
            <PieChart className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Admission Probability
            </span>
          </div>
          
          <div className="relative flex items-center justify-center h-28 w-28">
            {/* SVG Radial Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background ring */}
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* 72% segment (Green) */}
              <path
                className="text-emerald-500"
                strokeWidth="3.5"
                strokeDasharray="72, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* 20% segment (Blue) */}
              <path
                className="text-indigo-500"
                strokeWidth="3.5"
                strokeDasharray="20, 100"
                strokeDashoffset="-72"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* 8% segment (Red) */}
              <path
                className="text-rose-500"
                strokeWidth="3.5"
                strokeDasharray="8, 100"
                strokeDashoffset="-92"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">
                72%
              </span>
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                High Match
              </span>
            </div>
          </div>

          {/* Labels legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 justify-center text-[10px] font-semibold">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Eligible (72%)
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Reach (20%)
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Dream (8%)
            </span>
          </div>
        </div>

        {/* Chart 2: Horizontal Bar Chart - Placements */}
        <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-4">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Avg Package by College (LPA)
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: "IIT Bombay", value: 21.8, percent: 100, color: "bg-indigo-650" },
              { name: "IIT Delhi", value: 20.4, percent: 93, color: "bg-indigo-500" },
              { name: "IIT Madras", value: 19.6, percent: 90, color: "bg-indigo-400" },
              { name: "IIT Kanpur", value: 18.9, percent: 86, color: "bg-indigo-300" },
            ].map((col) => (
              <div key={col.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="truncate">{col.name}</span>
                  <span>₹{col.value} LPA</span>
                </div>
                <div className="h-2 w-full bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${col.color}`}
                    style={{ width: `${col.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights Footer Card */}
      <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 dark:border-indigo-500/20 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
            <Award className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider leading-none">
              Average Package
            </p>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              ₹20.17 LPA
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-450 border border-emerald-250/20">
          +12.4% YoY
        </span>
      </div>
    </div>
  );
}
