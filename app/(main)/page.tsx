import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Star,
  Zap,
  BarChart3,
  Target,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  GitCompareArrows,
  GraduationCap,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import CollegeCard from "@/components/college/CollegeCard";
import SearchBar from "@/components/college/SearchBar";


// ─── SEO Metadata ───────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "CampusPilot — Discover, Compare & Choose Colleges Smarter",
  description:
    "Discover colleges, compare rankings, placements and fees, and make informed education decisions with CampusPilot.",
  openGraph: {
    title: "CampusPilot — Discover, Compare & Choose Colleges Smarter",
    description:
      "Discover colleges, compare rankings, placements and fees, and make informed education decisions with CampusPilot.",
    type: "website",
    locale: "en_IN",
    siteName: "CampusPilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusPilot — Discover, Compare & Choose Colleges Smarter",
    description:
      "Discover colleges, compare rankings, placements and fees, and make informed education decisions with CampusPilot.",
  },
};

// ─── Force dynamic (live DB data) ─────────────────────────────────────────────
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ─── Data Fetching ────────────────────────────────────────────────────────────
async function getHomePageData() {
  const [totalColleges, totalCourses, stateAgg, ratingAgg, featuredColleges] =
    await Promise.all([
      prisma.college.count(),
      prisma.course.count(),
      prisma.college.findMany({
        select: { state: true },
        distinct: ["state"],
      }),
      prisma.college.aggregate({ _avg: { rating: true } }),
      prisma.college.findMany({
        orderBy: { rating: "desc" },
        take: 3,
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          state: true,
          type: true,
          rating: true,
          avgPackage: true,
          annualFees: true,
          nirfRank: true,
          thumbnail: true,
          description: true,
        },
      }),
    ]);

  return {
    stats: {
      totalColleges,
      totalCourses,
      totalStates: stateAgg.length,
      avgRating: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10,
    },
    featuredColleges,
  };
}

// ─── Static comparison data (allowed by prompt) ───────────────────────────────
const IIT_COMPARISON = [
  {
    name: "IIT Bombay",
    rank: 1,
    fees: "₹2.2L/yr",
    placement: "98%",
    avgPackage: "₹21.8 LPA",
  },
  {
    name: "IIT Delhi",
    rank: 2,
    fees: "₹2.1L/yr",
    placement: "97%",
    avgPackage: "₹20.4 LPA",
  },
  {
    name: "IIT Madras",
    rank: 3,
    fees: "₹2.3L/yr",
    placement: "96%",
    avgPackage: "₹19.6 LPA",
  },
  {
    name: "IIT Kanpur",
    rank: 4,
    fees: "₹2.0L/yr",
    placement: "95%",
    avgPackage: "₹18.9 LPA",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Smart Search",
    description:
      "Search thousands of colleges using real academic and placement data. Find exactly what fits your goals.",
    color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: GitCompareArrows,
    title: "Side-by-Side Compare",
    description:
      "Compare colleges instantly across fees, placements, rankings and ratings. Make data-driven decisions.",
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Target,
    title: "Personalised Match",
    description:
      "Find colleges aligned with your goals and preferences. Get recommendations tailored to your profile.",
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
  },
];

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Verified College Data",
    description: "All college information is sourced from official NIRF, UGC and NAAC records.",
    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    icon: RefreshCw,
    title: "Updated Placement Insights",
    description: "Placement data is refreshed annually from college annual reports and surveys.",
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: Star,
    title: "Transparent Ratings",
    description: "Ratings are computed from multiple verified sources, not self-reported numbers.",
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  },
  {
    icon: CheckCircle2,
    title: "Real Comparisons",
    description: "Compare colleges on equal footing with normalised, standardised metrics.",
    color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20",
  },
];

const QUICK_FILTERS = [
  { label: "Engineering", stream: "engineering", emoji: "⚙️" },
  { label: "MBA", stream: "mba", emoji: "💼" },
  { label: "Medical", stream: "medical", emoji: "🏥" },
  { label: "Design", stream: "design", emoji: "🎨" },
];

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function HomePage() {
  const { stats, featuredColleges } = await getHomePageData();

  return (
    <div className="w-full overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        className="relative min-h-[calc(100vh-64px)] flex items-center"
      >
        {/* Background split: left indigo gradient, right white */}
        <div className="absolute inset-0 flex">
          <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 dark:from-indigo-800 dark:via-indigo-900 dark:to-slate-950" />
          <div className="hidden md:block w-1/2 bg-[#F8F9FF] dark:bg-slate-950" />
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-white/5 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column — on indigo bg */}
            <div>
              {/* Pill label */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-sm font-medium text-white/90">
                  {stats.totalColleges.toLocaleString("en-IN")} colleges &amp; counting
                </span>
              </div>

              {/* Headline */}
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
              >
                Find your{" "}
                <span className="relative">
                  <span className="relative z-10 text-amber-300">future</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-2 bg-amber-400/30 rounded-full" aria-hidden="true" />
                </span>{" "}
                campus.
              </h1>

              {/* Subheading */}
              <p className="mt-6 text-lg sm:text-xl text-indigo-100 leading-relaxed max-w-xl">
                Discover, compare, and choose the right college with real data you
                can trust — personalised to your goals.
              </p>

              {/* Search Bar */}
              <div className="mt-8">
                <SearchBar size="lg" />
              </div>

              {/* Quick Filters */}
              <div className="mt-5 flex flex-wrap gap-2.5" role="group" aria-label="Quick subject filters">
                <span className="text-sm text-indigo-200 self-center">Browse by:</span>
                {QUICK_FILTERS.map((f) => (
                  <Link
                    key={f.stream}
                    href={`/discover?stream=${f.stream}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <span aria-hidden="true">{f.emoji}</span>
                    {f.label}
                  </Link>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="shadow-xl shadow-indigo-900/40">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/discover">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-white border border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    Explore Colleges
                  </Button>
                </Link>
              </div>

              {/* Live Stats */}
              <div
                className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
                aria-label="Platform statistics"
              >
                {[
                  {
                    value: `${stats.totalColleges.toLocaleString("en-IN")}`,
                    label: "Colleges",
                  },
                  {
                    value: `${stats.totalCourses.toLocaleString("en-IN")}`,
                    label: "Courses",
                  },
                  {
                    value: `${stats.totalStates}`,
                    label: "States",
                  },
                  {
                    value: `${stats.avgRating}★`,
                    label: "Avg Rating",
                  },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2.5"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-bold text-white">{value}</p>
                      <p className="text-xs text-indigo-200">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — decorative card stack (desktop only) */}
            <div className="hidden lg:flex flex-col gap-4 items-start pl-8">
              {/* Decorative floating card */}
              <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Top Ranked</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Live NIRF Rankings</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {["IIT Bombay", "IIT Delhi", "IIT Madras"].map((name, i) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
                      <div className="ml-auto flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${s <= 5 - i ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Small secondary card */}
              <div className="ml-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Avg Placement</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">₹8.4 LPA</p>
                </div>
                <div className="ml-2 flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">↑ 12%</span>
                </div>
              </div>

              {/* Third card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-4 w-64">
                <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">States Covered</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalStates} States</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURED COLLEGES
      ═══════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="featured-heading"
        className="py-20 bg-[#F8F9FF] dark:bg-slate-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Top Picks
              </p>
              <h2
                id="featured-heading"
                className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white"
              >
                Featured Colleges
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-lg">
                Handpicked top-rated colleges based on placements, infrastructure and student satisfaction.
              </p>
            </div>
            <Link
              href="/discover"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
            >
              View All
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* College Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredColleges.map((college) => (
              <CollegeCard key={college.id} {...college} />
            ))}
          </div>

          {/* Mobile: View All */}
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/discover">
              <Button variant="secondary" size="md">
                View All Colleges
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="features-heading"
        className="py-20 bg-white dark:bg-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Why CampusPilot
            </p>
            <h2
              id="features-heading"
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white"
            >
              Everything you need to choose confidently
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="group relative bg-[#F8F9FF] dark:bg-slate-800 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-indigo-50/60 dark:from-indigo-900/0 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" />

                <div className={`relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${color} mb-6`}>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="relative z-10 text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {title}
                </h3>
                <p className="relative z-10 text-slate-500 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COMPARISON PREVIEW
      ═══════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="compare-heading"
        className="py-20 bg-[#F8F9FF] dark:bg-slate-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left: copy */}
            <div className="lg:w-1/3 shrink-0">
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Compare Smarter
              </p>
              <h2
                id="compare-heading"
                className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4"
              >
                Side-by-side comparisons
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Stop guessing. Compare colleges across rankings, fees, placement
                rates and packages — all in one view.
              </p>
              <Link href="/compare">
                <Button size="md">
                  Compare Now
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            {/* Right: table */}
            <div className="w-full lg:flex-1 overflow-x-auto">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden min-w-[480px]">
                {/* Table header */}
                <div className="grid grid-cols-5 gap-0 bg-indigo-600 dark:bg-indigo-700 text-white text-xs font-semibold uppercase tracking-wide">
                  <div className="px-4 py-3 col-span-2">College</div>
                  <div className="px-4 py-3 text-center">NIRF Rank</div>
                  <div className="px-4 py-3 text-center">Fees/yr</div>
                  <div className="px-4 py-3 text-center">Avg Package</div>
                </div>

                {IIT_COMPARISON.map((college, idx) => (
                  <div
                    key={college.name}
                    className={`grid grid-cols-5 gap-0 border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors duration-150 ${
                      idx === 0 ? "bg-amber-50/30 dark:bg-amber-900/5" : ""
                    }`}
                  >
                    <div className="px-4 py-4 col-span-2 flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          idx === 0
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {college.name}
                      </span>
                    </div>
                    <div className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        #{college.rank}
                      </span>
                    </div>
                    <div className="px-4 py-4 text-center">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {college.fees}
                      </span>
                    </div>
                    <div className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {college.avgPackage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRUST SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="trust-heading"
        className="py-20 bg-white dark:bg-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2
              id="trust-heading"
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white"
            >
              Trusted by students across India
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              We build tools that put accuracy and transparency first so you can
              make the most important decision of your life with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: TrustIcon, title, description, color }) => (
              <div
                key={title}
                className="rounded-2xl bg-[#F8F9FF] dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-md dark:hover:shadow-none transition-shadow duration-200"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${color} mb-4`}>
                  <TrustIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="cta-heading"
        className="py-24 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 dark:from-indigo-800 dark:via-indigo-900 dark:to-slate-950"
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4"
          >
            Ready to find your ideal college?
          </h2>
          <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
            Start exploring colleges, comparing options and planning your future.
            Join thousands of students who chose smarter with CampusPilot.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-indigo-50 border-transparent shadow-xl shadow-indigo-900/30 font-bold"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button
                size="lg"
                variant="ghost"
                className="text-white border border-white/30 hover:bg-white/10 hover:text-white"
              >
                Explore Colleges
              </Button>
            </Link>
          </div>

          {/* Social proof strip */}
          <p className="mt-10 text-sm text-indigo-200">
            <span className="font-semibold text-white">
              {stats.totalColleges.toLocaleString("en-IN")} colleges
            </span>{" "}
            across{" "}
            <span className="font-semibold text-white">{stats.totalStates} states</span>{" "}
            ·{" "}
            <span className="font-semibold text-white">
              {stats.totalCourses.toLocaleString("en-IN")} courses
            </span>{" "}
            · Free to use
          </p>
        </div>
      </section>
    </div>
  );
}
