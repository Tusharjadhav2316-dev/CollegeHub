import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a fee number (INR) into a readable string like ₹2.4L/yr.
 * @param amount fee in rupees
 */
export function formatFees(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount) || amount === 0) {
    return "N/A";
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${Number(lakhs.toFixed(1))}L/yr`;
  }
  if (amount >= 1000) {
    const thousands = amount / 1000;
    return `₹${Number(thousands.toFixed(1))}k/yr`;
  }
  return `₹${amount}/yr`;
}

/**
 * Formats a package in LPA to the format ₹21.5 LPA.
 * @param lpa package in Lakhs Per Annum
 */
export function formatPackage(lpa: number | null | undefined): string {
  if (lpa === null || lpa === undefined || isNaN(lpa) || lpa === 0) {
    return "N/A";
  }
  return `₹${Number(lpa.toFixed(1))} LPA`;
}

/**
 * Returns Tailwind CSS class names for styling badges based on India states.
 * @param state state name
 */
export function getStateColor(state: string | null | undefined): string {
  if (!state) {
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700/30";
  }
  const s = state.trim().toLowerCase();
  if (s.includes("delhi")) {
    return "bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/30";
  } else if (s.includes("maharashtra")) {
    return "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30";
  } else if (s.includes("karnataka")) {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30";
  } else if (s.includes("tamil nadu") || s.includes("tamilnadu")) {
    return "bg-purple-50 text-purple-700 border border-purple-200/50 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800/30";
  } else if (s.includes("telangana") || s.includes("andhra")) {
    return "bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30";
  } else if (s.includes("west bengal")) {
    return "bg-teal-50 text-teal-700 border border-teal-200/50 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-800/30";
  } else if (s.includes("uttar pradesh")) {
    return "bg-orange-50 text-orange-700 border border-orange-200/50 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800/30";
  } else if (s.includes("rajasthan")) {
    return "bg-red-50 text-red-700 border border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30";
  } else if (s.includes("gujarat")) {
    return "bg-cyan-50 text-cyan-700 border border-cyan-200/50 dark:bg-cyan-950/20 dark:text-cyan-400 dark:border-cyan-800/30";
  } else {
    return "bg-slate-50 text-slate-700 border border-slate-200/50 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700/30";
  }
}
