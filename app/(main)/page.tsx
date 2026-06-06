import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  GitCompare,
  Sliders,
  Scale,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import CollegeCard from "@/components/college/CollegeCard";
import SearchBar from "@/components/college/SearchBar";
import ComparePreview from "@/components/college/ComparePreview";
import MiniAnalytics from "@/components/college/MiniAnalytics";
import { getHomepageStats } from "@/lib/homepage-stats";

// ─── SEO Metadata ───────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "CampusPilot — Find Your Future Campus",
  description:
    "Discover colleges, compare rankings, placements, fees and admissions with CampusPilot.",
  alternates: {
    canonical: "https://campuspilot.in",
  },
  openGraph: {
    title: "CampusPilot — Find Your Future Campus",
    description:
      "Discover colleges, compare rankings, placements, fees and admissions with CampusPilot.",
    type: "website",
    locale: "en_IN",
    siteName: "CampusPilot",
    url: "https://campuspilot.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusPilot — Find Your Future Campus",
    description:
      "Discover colleges, compare rankings, placements, fees and admissions with CampusPilot.",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ─── Quick Filter Data ──────────────────────────────────────────────────────
const QUICK_FILTERS = [
  { label: "Engineering", stream: "engineering", bg: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border border-orange-500/20" },
  { label: "MBA", stream: "mba", bg: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 border border-indigo-500/20" },
  { label: "Medical", stream: "medical", bg: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/20" },
  { label: "Design", stream: "design", bg: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/20" },
];

export default async function HomePage() {
  // Fetch live stats
  const stats = await getHomepageStats();

  // Fetch top 3 featured colleges sorted by rating and placements
  const featuredColleges = await prisma.college.findMany({
    orderBy: [
      { rating: "desc" },
      { avgPackage: "desc" },
    ],
    take: 3,
  });

  return (
    <div className="w-full overflow-x-hidden bg-[#F8F9FF] dark:bg-slate-950">
      
      {/* ═══════════════════════════════════════════════════════════════
          1. HERO SECTION (Split Layout)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center py-12 lg:py-0 overflow-hidden">
        {/* Background split */}
        <div className="absolute inset-0 flex flex-col md:flex-row pointer-events-none">
          <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950" />
          <div className="w-full md:w-1/2 bg-[#F8F9FF] dark:bg-slate-950" />
        </div>

        {/* Ambient glow effects */}
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-indigo-400/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column (Dark Side) */}
            <div className="text-left py-6 lg:py-16">
              
              {/* Online indicator label */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white/90 tracking-wide">
                  {stats.totalColleges.toLocaleString("en-IN")} Colleges Live Database
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Find your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">
                  future
                </span>{" "}
                campus.
              </h1>

              {/* Subheading */}
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Discover, compare, and choose the right college with real data you can trust — personalised to your goals.
              </p>

              {/* Advanced Search Bar Component */}
              <div className="mt-8">
                <SearchBar size="lg" />
              </div>

              {/* Quick Filters Pill Links */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Quick Filters:</span>
                {QUICK_FILTERS.map((f) => (
                  <Link
                    key={f.stream}
                    href={`/discover?stream=${f.stream}`}
                    className={`inline-flex items-center px-4 py-1.5 text-xs font-bold rounded-full transition-all ${f.bg}`}
                  >
                    {f.label}
                  </Link>
                ))}
              </div>

              {/* Live Statistics Row with status dots */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-8">
                {[
                  { value: stats.totalColleges.toLocaleString("en-IN"), label: "Colleges" },
                  { value: stats.totalCourses.toLocaleString("en-IN"), label: "Courses" },
                  { value: stats.statesCovered, label: "States" },
                  { value: `${stats.avgRating} ★`, label: "Avg Rating" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      <p className="text-base font-extrabold text-white leading-none">
                        {stat.value}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column (Light Side - Glass Widgets Stack) */}
            <div className="relative flex flex-col justify-center items-center lg:items-end pl-0 lg:pl-10 h-full py-6">
              
              {/* Stack Wrapper */}
              <div className="relative w-full max-w-md">
                
                {/* 1. Main College Glassmorphism Preview Card */}
                <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-3xl p-5 shadow-2xl z-10 transition-transform duration-300 hover:scale-[1.01]">
                  
                  {/* Top-right Rank overlay ribbon */}
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-bl-3xl rounded-tr-3xl shadow-md z-10">
                    #1 Engineering
                  </div>

                  <div className="flex gap-4">
                    {/* Small campus thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://picsum.photos/seed/bombay/400/300"
                      alt="IIT Bombay"
                      className="h-20 w-24 rounded-2xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200/50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://ui-avatars.com/api/?name=IITB&background=4F46E5&color=fff";
                      }}
                    />
                    
                    {/* Detail block */}
                    <div className="flex flex-col justify-between min-w-0 pr-12">
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate leading-snug">
                          IIT Bombay
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            4.9
                          </span>
                          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-medium">
                            (2,841 reviews)
                          </span>
                        </div>
                      </div>

                      {/* Pill Tag */}
                      <span className="inline-flex w-fit px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-500/10 text-orange-600 border border-orange-500/20">
                        Engineering
                      </span>
                    </div>
                  </div>

                </div>

                {/* 2. Floating Match Rate Badge Widget */}
                <div className="absolute -bottom-6 -right-4 bg-emerald-600 text-white rounded-2xl shadow-xl p-3.5 w-32 flex items-center justify-between z-20 hover:scale-105 transition-transform duration-300">
                  <div className="min-w-0">
                    <p className="text-xl font-extrabold leading-none">98%</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-100 mt-1">
                      Match Rate
                    </p>
                  </div>
                  
                  {/* Miniature Animated Trend Line SVG */}
                  <svg className="w-10 h-8 text-emerald-350 shrink-0 ml-1" viewBox="0 0 40 20" fill="none">
                    <path
                      d="M2 18 C 10 12, 15 15, 20 6 C 25 3, 30 5, 38 2"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 18 C 10 12, 15 15, 20 6 C 25 3, 30 5, 38 2 L 38 20 L 2 20 Z"
                      fill="url(#grad)"
                      opacity="0.1"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* 3. Floating Testimonial Bubble Card */}
                <div className="absolute -top-12 -left-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3 shadow-lg flex items-center gap-3 max-w-[280px] z-20 hover:scale-102 transition-transform">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-650 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    AR
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      &quot;Got into IIT Delhi in my first attempt!&quot;
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Arjun R., JEE 2024
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. FEATURED COLLEGES SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#F8F9FF] dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header row */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-2">
                Top Rated Picks
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Colleges
              </h2>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-450 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredColleges.map((college, idx) => (
              <CollegeCard
                key={college.id}
                rank={idx + 1}
                {...college}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. EVERYTHING YOU NEED SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-2">
              Why CampusPilot
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Everything you need to choose confidently
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sliders,
                title: "Smart Search",
                description: "Search colleges using rankings, placements, fees and academics.",
              },
              {
                icon: Scale,
                title: "Side-by-Side Compare",
                description: "Compare colleges instantly across fees, placements, and ratings in one unified view.",
              },
              {
                icon: Sparkles,
                title: "Personalised Match",
                description: "Find colleges aligned with your goals and entrance exam parameters.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#F8F9FF] dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-5 border border-indigo-100 dark:border-indigo-900/50">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. COMPARISON PREVIEW + MINI ANALYTICS SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#F8F9FF] dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-2">
              Analyse Options
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Compare Premier Camps Instantly
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Table layout (left 3/5 width on large desktop) */}
            <div className="lg:col-span-3">
              <ComparePreview />
            </div>
            
            {/* Visual analytics (right 2/5 width on large desktop) */}
            <div className="lg:col-span-2">
              <MiniAnalytics />
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. TRUST SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Trusted by students across India
            </h2>
            <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              We build tools that put accuracy and transparency first so you can make the most important decision of your life with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Verified Data",
                description: "All college details are cross-referenced with NIRF reports and academic databases.",
              },
              {
                icon: Award,
                title: "Transparent Rankings",
                description: "Objective ranking filters with detailed cutoff benchmarks and placement weights.",
              },
              {
                icon: TrendingUp,
                title: "Placement Insights",
                description: "Accurate placement packages compiled from verifiable corporate recruitment files.",
              },
              {
                icon: GitCompare,
                title: "College Comparisons",
                description: "Standardized fee grids and facilities tables for clear, peer comparisons.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#F8F9FF] dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. CTA SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 border-t border-slate-200/10">
        
        {/* Glow rings */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Ready to find your ideal college?
          </h2>
          <p className="text-sm sm:text-base text-slate-350 max-w-xl mx-auto leading-relaxed">
            Start exploring colleges, comparing options, and planning your future. Join thousands of students who chose smarter with CampusPilot.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-indigo-950 hover:bg-slate-50 border-transparent shadow-xl font-extrabold text-sm px-6 py-3"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/discover">
              <Button
                size="lg"
                variant="ghost"
                className="text-white border border-white/20 hover:bg-white/5 hover:text-white font-extrabold text-sm px-6 py-3"
              >
                Explore Colleges
              </Button>
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
