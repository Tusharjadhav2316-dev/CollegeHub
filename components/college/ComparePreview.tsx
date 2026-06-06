import React from "react";

interface ComparisonItem {
  name: string;
  rank: number;
  fees: string;
  cutoff: string;
  placement: string;
  avgPackage: string;
}

const COMPARISON_DATA: ComparisonItem[] = [
  {
    name: "IIT Bombay",
    rank: 1,
    fees: "₹2.4L",
    cutoff: "99.8%",
    placement: "98%",
    avgPackage: "₹21.8 LPA",
  },
  {
    name: "IIT Delhi",
    rank: 2,
    fees: "₹2.4L",
    cutoff: "99.6%",
    placement: "97%",
    avgPackage: "₹20.4 LPA",
  },
  {
    name: "IIT Madras",
    rank: 3,
    fees: "₹2.2L",
    cutoff: "99.5%",
    placement: "96%",
    avgPackage: "₹19.6 LPA",
  },
  {
    name: "IIT Kanpur",
    rank: 4,
    fees: "₹2.1L",
    cutoff: "99.2%",
    placement: "95%",
    avgPackage: "₹18.9 LPA",
  },
];

export default function ComparePreview() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                College
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                Ranking
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                Fees/yr
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                Cutoff
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                Placement
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                Avg Package
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {COMPARISON_DATA.map((col, idx) => (
              <tr
                key={col.name}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150"
              >
                <td className="px-5 py-4 font-semibold text-sm text-slate-950 dark:text-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {idx + 1}
                    </span>
                    {col.name}
                  </div>
                </td>
                <td className="px-4 py-4 text-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  #{col.rank}
                </td>
                <td className="px-4 py-4 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                  {col.fees}
                </td>
                <td className="px-4 py-4 text-center text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {col.cutoff}
                </td>
                <td className="px-4 py-4 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-500">
                  {col.placement}
                </td>
                <td className="px-4 py-4 text-center text-sm font-extrabold text-slate-850 dark:text-slate-200">
                  {col.avgPackage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
