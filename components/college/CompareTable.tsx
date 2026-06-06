"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
  Trophy,
  BookOpen,
  CheckCircle2,
  XCircle,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import { formatFees, formatPackage } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Course {
  id: string;
  name: string;
  duration: number;
  fees: number;
  seats: number | null;
}

interface CollegeData {
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
  description: string;
  location: string;
  courses: Course[];
  _count: { reviews: number };
}

interface Highlights {
  bestNirfRank: number | null;
  bestAnnualFees: number | null;
  bestAvgPackage: number | null;
  bestRating: number | null;
}

interface CompareTableProps {
  colleges: CollegeData[];
  highlights: Highlights;
}

// ─── Helper: Cell Highlight Classes ─────────────────────────────────────────

function isBestNirf(college: CollegeData, highlights: Highlights) {
  return (
    college.nirfRank !== null &&
    highlights.bestNirfRank !== null &&
    college.nirfRank === highlights.bestNirfRank
  );
}

function isBestFees(college: CollegeData, highlights: Highlights) {
  return (
    highlights.bestAnnualFees !== null &&
    college.annualFees === highlights.bestAnnualFees
  );
}

function isBestPackage(college: CollegeData, highlights: Highlights) {
  return (
    highlights.bestAvgPackage !== null &&
    college.avgPackage === highlights.bestAvgPackage
  );
}

function isBestRating(college: CollegeData, highlights: Highlights) {
  return (
    highlights.bestRating !== null &&
    college.rating === highlights.bestRating
  );
}

// ─── Sub Components ──────────────────────────────────────────────────────────

function ColHeader({
  college,
  highlights,
}: {
  college: CollegeData;
  highlights: Highlights;
}) {
  const [imgSrc, setImgSrc] = useState(college.thumbnail);
  const isBest =
    isBestRating(college, highlights) ||
    isBestPackage(college, highlights) ||
    isBestFees(college, highlights) ||
    isBestNirf(college, highlights);

  return (
    <div
      className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl transition-all ${
        isBest
          ? "bg-gradient-to-b from-indigo-50 to-white border-2 border-indigo-200 shadow-lg shadow-indigo-100"
          : "bg-white border border-slate-200"
      }`}
    >
      {isBest && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
          <Crown className="h-3 w-3" />
          BEST MATCH
        </div>
      )}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-100">
        <Image
          src={imgSrc}
          alt={college.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          onError={() =>
            setImgSrc(
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                college.name
              )}&background=4F46E5&color=fff&size=200`
            )
          }
        />
      </div>
      <div className="text-center w-full">
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
          {college.type}
        </span>
        <h3 className="text-[15px] font-extrabold text-slate-900 leading-tight mt-0.5 line-clamp-2">
          {college.name}
        </h3>
        <div className="flex items-center justify-center gap-1 mt-1.5">
          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
          <span className="text-[12px] text-slate-500 truncate">
            {college.city ? `${college.city}, ${college.state}` : college.state}
          </span>
        </div>
      </div>
      <Link
        href={`/colleges/${college.slug}`}
        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98] shadow-md shadow-indigo-200"
      >
        View Details
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// ─── Stat Cell ───────────────────────────────────────────────────────────────

function StatCell({
  value,
  isBest,
  suffix,
}: {
  value: string;
  isBest: boolean;
  suffix?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-3 py-4 rounded-xl transition-all ${
        isBest
          ? "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm"
          : "bg-slate-50 border border-transparent"
      }`}
    >
      <span
        className={`text-[16px] font-extrabold leading-tight ${
          isBest ? "text-emerald-700" : "text-slate-900"
        }`}
      >
        {value}
      </span>
      {suffix && (
        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
          {suffix}
        </span>
      )}
      {isBest && (
        <span className="flex items-center gap-0.5 text-[9px] font-black text-emerald-600 mt-1 uppercase tracking-wide">
          <CheckCircle2 className="h-2.5 w-2.5" />
          Best
        </span>
      )}
    </div>
  );
}

// ─── Row Label ───────────────────────────────────────────────────────────────

function RowLabel({
  icon,
  label,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-4 px-2 sticky left-0 bg-white z-10 border-r border-slate-100 pr-4">
      <div className="flex items-center gap-2 text-slate-700">
        {icon}
        <span className="text-[13px] font-bold">{label}</span>
      </div>
      {sublabel && (
        <span className="text-[11px] text-slate-400 pl-6">{sublabel}</span>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CompareTable({
  colleges,
  highlights,
}: CompareTableProps) {
  const colCount = colleges.length;

  // Grid template: label col + college cols
  const gridCols =
    colCount === 2
      ? "grid-cols-[200px_1fr_1fr]"
      : colCount === 3
      ? "grid-cols-[180px_1fr_1fr_1fr]"
      : "grid-cols-[160px_1fr_1fr_1fr_1fr]";

  const rowClass = `grid ${gridCols} gap-3 items-stretch border-b border-slate-100 last:border-b-0`;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-[800px] lg:min-w-0">
        {/* ─── Header Row: College Cards ─── */}
        <div className={`grid ${gridCols} gap-3 p-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-slate-200`}>
          {/* Empty label cell */}
          <div className="flex items-end pb-1 sticky left-0 bg-white md:bg-transparent z-10 border-r md:border-r-0 border-slate-100 pr-4">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Comparing {colCount} Colleges
            </span>
          </div>
          {colleges.map((college) => (
            <ColHeader key={college.id} college={college} highlights={highlights} />
          ))}
        </div>

      {/* ─── Data Rows ─── */}
      <div className="p-4 flex flex-col gap-2">

        {/* NIRF Rank */}
        <div className={rowClass}>
          <RowLabel
            icon={<Trophy className="h-4 w-4 text-amber-500" />}
            label="NIRF Rank"
            sublabel="Lower is better"
          />
          {colleges.map((c) => (
            <StatCell
              key={c.id}
              value={c.nirfRank ? `#${c.nirfRank}` : "N/A"}
              isBest={isBestNirf(c, highlights)}
            />
          ))}
        </div>

        {/* Rating */}
        <div className={rowClass}>
          <RowLabel
            icon={<Star className="h-4 w-4 text-amber-400" />}
            label="Rating"
            sublabel="Out of 5.0"
          />
          {colleges.map((c) => (
            <StatCell
              key={c.id}
              value={c.rating.toFixed(1)}
              isBest={isBestRating(c, highlights)}
              suffix={`${c._count.reviews} reviews`}
            />
          ))}
        </div>

        {/* Annual Fees */}
        <div className={rowClass}>
          <RowLabel
            icon={<DollarSign className="h-4 w-4 text-blue-500" />}
            label="Annual Fees"
            sublabel="Lower is better"
          />
          {colleges.map((c) => (
            <StatCell
              key={c.id}
              value={formatFees(c.annualFees)}
              isBest={isBestFees(c, highlights)}
            />
          ))}
        </div>

        {/* Avg Package */}
        <div className={rowClass}>
          <RowLabel
            icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
            label="Avg. Package"
            sublabel="Higher is better"
          />
          {colleges.map((c) => (
            <StatCell
              key={c.id}
              value={formatPackage(c.avgPackage)}
              isBest={isBestPackage(c, highlights)}
            />
          ))}
        </div>

        {/* Location */}
        <div className={rowClass}>
          <RowLabel
            icon={<MapPin className="h-4 w-4 text-rose-500" />}
            label="Location"
          />
          {colleges.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-center px-3 py-4"
            >
              <span className="text-[13px] font-semibold text-slate-700 text-center">
                {c.city ? `${c.city}, ${c.state}` : c.state}
              </span>
            </div>
          ))}
        </div>

        {/* Type */}
        <div className={rowClass}>
          <RowLabel
            icon={<BookOpen className="h-4 w-4 text-indigo-500" />}
            label="Type"
          />
          {colleges.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-center px-3 py-4"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                {c.type}
              </span>
            </div>
          ))}
        </div>

        {/* Courses Available */}
        <div className={rowClass}>
          <RowLabel
            icon={<BookOpen className="h-4 w-4 text-purple-500" />}
            label="Courses"
            sublabel="Top courses offered"
          />
          {colleges.map((c) => (
            <div
              key={c.id}
              className="px-3 py-4 flex flex-col gap-1.5"
            >
              {c.courses.length > 0 ? (
                c.courses.slice(0, 4).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                    <span className="line-clamp-1">{course.name}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <XCircle className="h-3 w-3 shrink-0" />
                  No courses listed
                </div>
              )}
              {c.courses.length > 4 && (
                <span className="text-[10px] text-indigo-500 font-bold">
                  +{c.courses.length - 4} more
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}
