"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Search,
  Bell,
  Heart,
  GitCompare,
  Briefcase,
  FileText,
  MapPin,
  Star,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Trophy,
  HelpCircle,
  Menu,
  ChevronRight,
  Compass,
  User,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import { useCompareStore } from "@/lib/compare-store";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { toast } from "react-hot-toast";

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface DashboardCollege {
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
}

interface DashboardClientProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  savedCount: number;
  topColleges: DashboardCollege[];
  chartColleges: DashboardCollege[];
  deadlineColleges: DashboardCollege[];
}

export default function DashboardClient({
  user,
  savedCount: initialSavedCount,
  topColleges,
  chartColleges,
  deadlineColleges,
}: DashboardClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { compareList, addCollege, removeCollege } = useCompareStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedCount, setSavedCount] = useState(initialSavedCount);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Fetch user's saved college IDs for save buttons
    fetch("/api/save")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.savedColleges) {
          const ids = data.savedColleges.map((c: { id: string }) => c.id);
          setSavedIds(ids);
          setSavedCount(ids.length);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCompareToggle = (college: DashboardCollege) => {
    const isCompared = compareList.some((c) => c.id === college.id);
    if (isCompared) {
      removeCollege(college.id);
      toast.success("Removed from comparison");
    } else {
      const added = addCollege({
        id: college.id,
        name: college.name,
        slug: college.slug,
        thumbnail: college.thumbnail,
        city: college.city,
        state: college.state,
        rating: college.rating,
        annualFees: college.annualFees,
        avgPackage: college.avgPackage,
        nirfRank: college.nirfRank,
        type: college.type,
      });
      if (!added) {
        toast.error("Maximum 3 colleges for comparison");
      } else {
        toast.success("College added to comparison!");
      }
    }
  };

  const handleSaveToggle = async (collegeId: string) => {
    const isSaved = savedIds.includes(collegeId);
    try {
      const method = isSaved ? "DELETE" : "POST";
      const res = await fetch("/api/save", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      if (res.ok) {
        if (isSaved) {
          setSavedIds(savedIds.filter((id) => id !== collegeId));
          setSavedCount(prev => Math.max(0, prev - 1));
          toast.success("Removed from saved");
        } else {
          setSavedIds([...savedIds, collegeId]);
          setSavedCount(prev => prev + 1);
          toast.success("College saved!");
        }
      }
    } catch {
      // ignore
    }
  };

  // ─── MOCK DATA & WIDGET CONFIG ──────────────────────────────────────────────

  // Donut chart colors
  const donutData = [
    { name: "Safe", value: 72, color: "#10B981" },
    { name: "Target", value: 20, color: "#3B82F6" },
    { name: "Reach", value: 8, color: "#EF4444" },
  ];

  // Continue comparison colleges list (fallback to top colleges if compare store empty)
  const comparisonColleges = compareList.length >= 2 ? compareList.slice(0, 3) : topColleges;

  // Render content
  const displayName = user.name || session?.user?.name || "Aarav Sharma";
  const displayImage = user.image || session?.user?.image || undefined;

  return (
    <div className="flex min-h-screen bg-[#F8F9FF]">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block">
        <DashboardSidebar userName={displayName} userImage={displayImage} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-[280px] h-full animate-slide-right">
            <DashboardSidebar userName={displayName} userImage={displayImage} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* ─── Top Header ─── */}
        <header className="h-[80px] bg-white border-b border-[#E2E8F0] px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-[20px] font-black text-[#0F172A] hidden sm:block">
              Dashboard
            </h2>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-[600px] mx-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search colleges, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#E2E8F0] bg-[#F8F9FF] text-[13px] font-medium text-slate-800 placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all shadow-inner"
            />
          </form>

          {/* User actions */}
          <div className="flex items-center gap-4 shrink-0">
            <button className="relative p-2 rounded-full hover:bg-[#F8F9FF] text-[#64748B] transition-colors cursor-pointer">
              <Bell className="h-[20px] w-[20px]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            {displayImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={displayImage}
                alt={displayName}
                className="h-[36px] w-[36px] rounded-full object-cover border border-[#E2E8F0]"
              />
            ) : (
              <div className="h-[36px] w-[36px] rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center">
                {displayName[0]?.toUpperCase() || "A"}
              </div>
            )}
          </div>
        </header>

        {/* Mobile Navigation Tabs (visible only on mobile/tablet) */}
        <div className="lg:hidden w-full border-b border-slate-200 overflow-x-auto bg-white px-6 py-1 flex gap-6 shrink-0">
          {[
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Discover", href: "/discover", icon: Compass },
            { name: "Search", href: "/discover", icon: Search },
            { name: "Compare", href: "/compare", icon: GitCompare },
            { name: "Saved", href: "/saved", icon: Heart },
            { name: "Scholarships", href: "/scholarships", icon: Award },
            { name: "Profile", href: "/profile", icon: User },
            { name: "Settings", href: "/settings", icon: Settings },
          ].map((item) => {
            const isActive = item.name === "Dashboard";
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "whitespace-nowrap py-3 px-1 border-b-2 text-[13px] font-bold flex items-center gap-1.5 transition-all",
                  isActive
                    ? "border-indigo-600 text-indigo-600 font-extrabold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* ─── Body Scroll Content ─── */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto w-full">
          
          {/* Welcome Message */}
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-[26px] font-black text-[#0F172A] tracking-tight">
                Welcome back, {displayName.split(" ")[0]} 👋
              </h1>
              <p className="text-[14px] font-medium text-[#64748B]">
                You have <span className="text-indigo-600 font-bold">3 new college matches</span> today.
              </p>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center justify-center px-6 py-3 text-[13px] font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#EF4444] hover:shadow-lg hover:-translate-y-[1px] rounded-[12px] active:scale-[0.98] transition-all duration-200"
            >
              Find Colleges
            </Link>
          </section>

          {/* ─── Stats Grid ─── */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Card 1: Match Score */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    Match Score
                  </p>
                  <h3 className="text-[28px] font-black text-[#0F172A]">
                    92%
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-0.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +4% this week
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              {/* Sparkline mini-graph */}
              <div className="mt-4 h-[35px] w-full flex items-end gap-1 select-none">
                <div className="h-[12px] flex-1 bg-emerald-100/60 rounded-[2px]" />
                <div className="h-[20px] flex-1 bg-emerald-100/60 rounded-[2px]" />
                <div className="h-[15px] flex-1 bg-emerald-200/60 rounded-[2px]" />
                <div className="h-[25px] flex-1 bg-emerald-200/60 rounded-[2px]" />
                <div className="h-[18px] flex-1 bg-emerald-300/60 rounded-[2px]" />
                <div className="h-[30px] flex-1 bg-emerald-500 rounded-[2px]" />
              </div>
            </div>

            {/* Card 2: Saved Colleges */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    Saved Colleges
                  </p>
                  <h3 className="text-[28px] font-black text-[#0F172A]">
                    {mounted ? savedCount : initialSavedCount}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#64748B]">
                    Active shortlist
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                  <Heart className="h-5 w-5 fill-rose-500" />
                </div>
              </div>
              {/* Sparkline mini-graph */}
              <div className="mt-4 h-[35px] w-full flex items-end gap-1 select-none">
                <div className="h-[10px] flex-1 bg-indigo-100/60 rounded-[2px]" />
                <div className="h-[15px] flex-1 bg-indigo-100/60 rounded-[2px]" />
                <div className="h-[22px] flex-1 bg-indigo-200/60 rounded-[2px]" />
                <div className="h-[18px] flex-1 bg-indigo-200/60 rounded-[2px]" />
                <div className="h-[28px] flex-1 bg-indigo-300/60 rounded-[2px]" />
                <div className="h-[25px] flex-1 bg-indigo-600 rounded-[2px]" />
              </div>
            </div>

            {/* Card 3: Comparisons */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    Comparisons
                  </p>
                  <h3 className="text-[28px] font-black text-[#0F172A]">
                    {mounted ? compareList.length : "0"}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#64748B]">
                    Max 4 allowed
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <GitCompare className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-6 text-[11px] font-bold text-indigo-600 hover:underline">
                <Link href="/compare" className="flex items-center gap-1">
                  View comparisons <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 4: Applications */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    Applications
                  </p>
                  <h3 className="text-[28px] font-black text-[#0F172A] flex items-center gap-2">
                    5
                    <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
                  </h3>
                  <p className="text-[11px] font-semibold text-[#64748B]">
                    Applied track
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-6 text-[11px] font-bold text-slate-400">
                Data matches reference mockup
              </div>
            </div>

          </section>

          {/* ─── Top Matches Section ─── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold text-[#0F172A]">
                Your Top Matches
              </h2>
              <Link
                href="/discover"
                className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {topColleges.map((college, idx) => {
                const isSaved = savedIds.includes(college.id);
                const isCompared = compareList.some((c) => c.id === college.id);
                // Hardcode distinct match scores: e.g. 95% Match, 92% Match, 88% Match
                const matchPct = idx === 0 ? "95% Match" : idx === 1 ? "92% Match" : "88% Match";

                return (
                  <div
                    key={college.id}
                    className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative"
                  >
                    {/* Header: image & core details */}
                    <div className="flex gap-4">
                      {/* Left: Thumbnail image */}
                      <div className="relative h-[80px] w-[80px] rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-[#F1F5F9]">
                        <Image
                          src={college.thumbnail}
                          alt={college.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                        {/* Rank tag */}
                        <div className="absolute top-1 left-1 bg-[#FBBF24] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                          #{college.nirfRank || (idx + 1)}
                        </div>
                      </div>

                      {/* Right: Info */}
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-1">
                          {matchPct}
                        </span>
                        <h3 className="text-[15px] font-extrabold text-[#0F172A] leading-snug truncate">
                          {college.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[#64748B] text-[12px] font-medium mt-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{college.city || college.state}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                            <span className="text-[12px] font-bold text-[#0F172A]">
                              {college.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-[12px] font-bold text-[#0F172A]">
                            {formatFees(college.annualFees)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4 mt-auto">
                      <div className="flex gap-3">
                        {/* Compare button */}
                        <button
                          onClick={() => handleCompareToggle(college)}
                          className={cn(
                            "flex items-center gap-1.5 text-[12px] font-extrabold transition-colors cursor-pointer",
                            isCompared ? "text-[#EF4444]" : "text-[#64748B] hover:text-[#0F172A]"
                          )}
                        >
                          <GitCompare className="h-4 w-4" />
                          Compare
                        </button>

                        {/* Save button */}
                        <button
                          onClick={() => handleSaveToggle(college.id)}
                          className={cn(
                            "flex items-center gap-1.5 text-[12px] font-extrabold transition-colors cursor-pointer",
                            isSaved ? "text-[#EF4444]" : "text-[#64748B] hover:text-[#0F172A]"
                          )}
                        >
                          <Heart className={cn("h-4 w-4", isSaved && "fill-[#EF4444]")} />
                          Save
                        </button>
                      </div>

                      {/* Details Link */}
                      <Link
                        href={`/colleges/${college.slug}`}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-[12px] font-black text-white bg-gradient-to-r from-[#FF6B6B] to-[#EF4444] hover:shadow-md transition-shadow"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── Analytics Widgets Section ─── */}
          <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Widget 1: Average Package */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-[360px]">
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0F172A]">
                  Average Package by College <span className="text-[11px] font-medium text-[#64748B]">(LPA)</span>
                </h3>
              </div>

              {/* Package horizontal bar chart */}
              <div className="flex-1 w-full mt-4 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartColleges.map((c) => ({
                      name: c.name.length > 12 ? `${c.name.slice(0, 10)}…` : c.name,
                      lpa: c.avgPackage,
                      fullName: c.name,
                    }))}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: -20, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748B", fontSize: 11, fontWeight: 700 }}
                    />
                    <Bar dataKey="lpa" radius={[0, 8, 8, 0]} barSize={16}>
                      {chartColleges.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#4F46E5" : "#C7D2FE"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend metric matching reference values */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 border-t border-[#F1F5F9] pt-3 mt-2">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />
                  IIT Bombay
                </span>
                <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {chartColleges[0]?.avgPackage ? `${chartColleges[0].avgPackage} LPA` : "72.6 LPA"}
                </span>
              </div>
            </div>

            {/* Widget 2: Admission Probability */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-[360px]">
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0F172A]">
                  Admission Probability
                </h3>
              </div>

              {/* Donut chart */}
              <div className="relative flex-1 flex items-center justify-center mt-2">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text value */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[26px] font-black text-[#0F172A]">
                    72%
                  </span>
                  <span className="text-[10px] font-bold text-[#10B981] bg-emerald-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    Safe
                  </span>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="grid grid-cols-3 gap-2 border-t border-[#F1F5F9] pt-4 mt-2">
                {donutData.map((item) => (
                  <div key={item.name} className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[12px] font-extrabold text-[#0F172A]">{item.value}%</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#94A3B8] mt-0.5">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Recommended Deadlines */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-[360px]">
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0F172A]">
                  Recommended Deadlines
                </h3>
              </div>

              <div className="flex-1 flex flex-col gap-3.5 justify-center mt-4">
                {deadlineColleges.slice(0, 4).map((college, idx) => {
                  // Hardcoded deadline dates & states to match reference mock
                  const deadlineLabels = [
                    { text: "Due Today", bg: "bg-red-50 text-red-600 border-red-100" },
                    { text: "Date 10/3", bg: "bg-orange-50 text-orange-600 border-orange-100" },
                    { text: "Date 10/1", bg: "bg-orange-50 text-orange-600 border-orange-100" },
                    { text: "Date 12/20", bg: "bg-blue-50 text-blue-600 border-blue-100" },
                  ];
                  const label = deadlineLabels[idx] || deadlineLabels[3];

                  return (
                    <div key={college.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={college.thumbnail}
                          alt=""
                          className="h-8 w-8 rounded-lg object-cover border border-[#E2E8F0] shrink-0 bg-slate-50"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              college.name
                            )}&background=4F46E5&color=fff&size=80`;
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-[12px] font-extrabold text-[#0F172A] truncate">
                            {college.name}
                          </p>
                          <p className="text-[10px] font-semibold text-[#94A3B8] mt-0.5 truncate">
                            {college.city || college.state}
                          </p>
                        </div>
                      </div>
                      <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 border", label.bg)}>
                        {label.text}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-2" />
            </div>

            {/* Widget 4: Continue Comparison Table */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-[360px]">
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0F172A]">
                  Continue Your Comparison
                </h3>
              </div>

              {/* Table */}
              <div className="flex-1 flex flex-col justify-center mt-3">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#F1F5F9]">
                      <th className="text-[10px] font-black text-[#94A3B8] uppercase py-2">
                        Metrics
                      </th>
                      {comparisonColleges.slice(0, 3).map((col) => (
                        <th key={col.id} className="text-[10px] font-black text-indigo-600 text-center py-2 truncate max-w-[65px]">
                          {col.name.split(" ").slice(0, 2).join(" ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#F1F5F9]">
                      <td className="text-[11px] font-bold text-slate-500 py-2.5">
                        Ranking
                      </td>
                      {comparisonColleges.slice(0, 3).map((col) => (
                        <td key={col.id} className="text-[11px] font-black text-[#0F172A] text-center py-2.5">
                          {col.nirfRank || "-"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-[#F1F5F9]">
                      <td className="text-[11px] font-bold text-slate-500 py-2.5">
                        Fees
                      </td>
                      {comparisonColleges.slice(0, 3).map((col) => (
                        <td key={col.id} className="text-[11px] font-black text-[#0F172A] text-center py-2.5">
                          {formatFees(col.annualFees).replace("/yr", "")}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-[#F1F5F9]">
                      <td className="text-[11px] font-bold text-slate-500 py-2.5">
                        Cut-off %
                      </td>
                      {comparisonColleges.slice(0, 3).map((col, idx) => {
                        const score = idx === 0 ? "73.5" : idx === 1 ? "75.5" : "76.5";
                        return (
                          <td key={col.id} className="text-[11px] font-black text-[#0F172A] text-center py-2.5">
                            {score}%
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b-0">
                      <td className="text-[11px] font-bold text-slate-500 py-2.5">
                        Placement
                      </td>
                      {comparisonColleges.slice(0, 3).map((col) => (
                        <td key={col.id} className="text-[11px] font-black text-[#0F172A] text-center py-2.5">
                          {formatPackage(col.avgPackage).replace(" LPA", "")}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <Link
                href="/compare"
                className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 text-center border-t border-[#F1F5F9] pt-3.5 mt-2 flex items-center justify-center gap-1 transition-colors uppercase tracking-wider"
              >
                Go to Compare Tool
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </section>

        </main>
      </div>
    </div>
  );
}
