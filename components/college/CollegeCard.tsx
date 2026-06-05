import React from "react";
import Link from "next/link";
import { MapPin, Trophy, TrendingUp, IndianRupee, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatFees, formatPackage, cn } from "@/lib/utils";
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
  if (t.includes("government") || t.includes("govt") || t.includes("public")) return "Government";
  if (t.includes("private")) return "Private";
  if (t.includes("deemed")) return "Deemed";
  return type;
}

export default function CollegeCard({
  name,
  slug,
  city,
  state,
  type,
  rating,
  avgPackage,
  annualFees,
  nirfRank,
  thumbnail,
  className,
}: CollegeCardProps) {
  const location = city ? `${city}, ${state}` : state;

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
        "rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1",
        "transition-all duration-300 ease-out overflow-hidden",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden bg-indigo-50 dark:bg-slate-800">
        {/* College thumbnail — external URLs need domain config for next/image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={`${name} campus`}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&size=400&bold=true&format=svg`;
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* NIRF Badge overlay */}
        {nirfRank && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              #{nirfRank} NIRF
            </span>
          </div>
        )}

        {/* Type Badge overlay */}
        <div className="absolute top-3 right-3">
          <Badge variant={getTypeVariant(type)}>{getTypeLabel(type)}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Name */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
          {name}
        </h3>

        {/* Location */}
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{location}</span>
        </div>

        {/* Rating */}
        <div className="mt-3">
          <RatingStars rating={rating} starSize={14} showNumeric />
        </div>

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Annual Fees */}
          <div className="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
              <IndianRupee className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Annual Fees
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {formatFees(annualFees)}
              </p>
            </div>
          </div>

          {/* Avg Package */}
          <div className="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Avg Package
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {formatPackage(avgPackage)}
              </p>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer CTA */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={`/colleges/${slug}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-50 hover:bg-indigo-600 dark:bg-indigo-900/20 dark:hover:bg-indigo-600 text-indigo-700 hover:text-white dark:text-indigo-400 dark:hover:text-white text-sm font-semibold py-2.5 transition-all duration-200 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            aria-label={`View details for ${name}`}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
