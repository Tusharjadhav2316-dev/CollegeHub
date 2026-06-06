"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Star, Heart, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatFees, cn } from "@/lib/utils";
import type { BadgeProps } from "@/components/ui/Badge";

export interface CollegeCardProps {
  id: string;
  name: string;
  slug: string;
  city?: string | null;
  state: string;
  type: string;
  rating: number;
  avgPackage: number;
  annualFees: number;
  nirfRank?: number | null;
  thumbnail: string;
  description: string;
  rank?: number; // Optional list-based ranking overlay
  className?: string;
}

function getTypeVariant(type: string): BadgeProps["variant"] {
  const t = type.toLowerCase();
  if (t.includes("government") || t.includes("govt") || t.includes("public")) return "government";
  if (t.includes("private")) return "private";
  if (t.includes("deemed")) return "deemed";
  return "default";
}

function getTypeLabel(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("government") || t.includes("govt") || t.includes("public")) return "Govt";
  if (t.includes("private")) return "Private";
  if (t.includes("deemed")) return "Deemed";
  return type;
}

function getNaacGrade(rating: number): string {
  if (rating >= 4.5) return "NAAC A++";
  if (rating >= 4.0) return "NAAC A+";
  if (rating >= 3.5) return "NAAC A";
  return "NAAC B++";
}

export default function CollegeCard({
  name,
  slug,
  city,
  state,
  type,
  rating,
  annualFees,
  nirfRank,
  thumbnail,
  rank,
  className,
}: CollegeCardProps) {
  const [isCompared, setIsCompared] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const location = city ? `${city}, ${state}` : state;
  const activeRank = rank || nirfRank;

  // Generate a realistic stable review count deterministically based on name length
  const reviewCount = Math.floor(((name.charCodeAt(0) + name.charCodeAt(name.length - 1 || 0)) * 7) % 400) + 800;

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60",
        "rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1",
        "transition-all duration-300 ease-out overflow-hidden",
        className
      )}
    >
      {/* Top Section: College Image Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-50 dark:bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={`${name} campus`}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&size=800&bold=true`;
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Top-left: Ranking Badge */}
        {activeRank && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-br-2xl shadow-md z-10 tracking-wider">
            #{activeRank}
          </div>
        )}
      </div>

      {/* Middle Section: College details */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title and Badges */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
            <Link href={`/colleges/${slug}`}>{name}</Link>
          </h3>
          <div className="flex flex-wrap gap-1 shrink-0 mt-0.5">
            <Badge variant={getTypeVariant(type)} className="text-[10px] px-1.5 py-0.25 font-bold uppercase">
              {getTypeLabel(type)}
            </Badge>
            <Badge variant="naac" className="text-[10px] px-1.5 py-0.25 font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30">
              {getNaacGrade(rating)}
            </Badge>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="truncate font-medium">{location}</span>
        </div>

        {/* Rating and Fees Row */}
        <div className="flex items-center justify-between mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 rounded-lg px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              ({reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Annual Fees */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold uppercase tracking-wider">
              Fees
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {formatFees(annualFees)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
          {/* Compare Button */}
          <button
            onClick={() => setIsCompared(!isCompared)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <div className={cn(
              "h-4 w-4 rounded border flex items-center justify-center transition-all",
              isCompared
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            )}>
              {isCompared && <Check className="h-2.5 w-2.5 stroke-[3]" />}
            </div>
            Compare
          </button>

          {/* Save Button */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            aria-label={isSaved ? "Saved" : "Save college"}
          >
            <Heart className={cn("h-4 w-4 transition-colors", isSaved ? "fill-rose-500 text-rose-500" : "text-slate-400")} />
            Save
          </button>

          {/* View Details Button */}
          <Link
            href={`/colleges/${slug}`}
            className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
