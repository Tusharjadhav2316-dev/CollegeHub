import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Sliders,
  GitCompare,
  Sparkles,
  TrendingUp,
  Star
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import CollegeCard from "@/components/college/CollegeCard";
import { getHomepageStats } from "@/lib/homepage-stats";

export const metadata: Metadata = {
  title: "CampusPilot — Find Your Future Campus",
  description:
    "Discover colleges, compare rankings, placements, fees and admissions with CampusPilot.",
  alternates: {
    canonical: "https://campuspilot.in",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const stats = await getHomepageStats();

  // Wrap DB call so the page renders even when Neon is temporarily unreachable
  let featuredColleges: Awaited<ReturnType<typeof prisma.college.findMany>> = [];
  try {
    featuredColleges = await prisma.college.findMany({
      where: { nirfRank: { not: null } },
      orderBy: { nirfRank: "asc" },
      take: 3,
    });

    if (featuredColleges.length === 0) {
      featuredColleges = await prisma.college.findMany({
        orderBy: { rating: "desc" },
        take: 3,
      });
    }
  } catch (err) {
    console.error("Failed to fetch featured colleges:", err);
    // Page renders with empty cards grid — no crash
  }

  return (
    <div className="w-full overflow-x-hidden bg-white">
      
      {/* HERO SECTION */}
      <section className="relative w-full pt-[120px] pb-[80px] sm:pt-[160px] sm:pb-[100px] flex items-center justify-center min-h-[70vh]">
        
        {/* Soft Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EEF2FF] via-[#F8FAFC] to-white z-0"></div>
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-400/20 rounded-full blur-[120px] z-0 pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center text-center max-w-[750px] mx-auto relative">
            
            {/* Main Heading */}
            <h1 className="text-[40px] sm:text-[54px] md:text-[62px] font-[750] leading-[1.1] tracking-[-0.03em] mb-6 relative z-20 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#EF4444] bg-clip-text text-transparent animate-gradient-text">
              Find your future campus.
            </h1>
            
            {/* Subheading */}
            <p className="text-[18px] sm:text-[20px] text-[#64748B] max-w-[600px] leading-relaxed mx-auto mb-10 relative z-20 font-medium tracking-tight">
              Discover, compare, and choose the right college with real data you can trust — personalised to your goals.
            </p>

            {/* Floating Mini Card (IIT Bombay) — pushed well outside text zone */}
            <div className="hidden xl:flex absolute top-4 -left-[280px] 2xl:-left-[340px] bg-white/80 backdrop-blur-md rounded-[16px] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 items-center gap-3 hover:scale-105 hover:-translate-y-1 transition-all duration-300 z-30">
              <div className="relative h-[60px] w-[60px] rounded-[12px] overflow-hidden shrink-0 bg-slate-100">
                <Image 
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80" 
                  alt="IIT Bombay" 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute top-0 left-0 bg-[#FBBF24] text-white text-[9px] font-[900] px-1.5 py-0.5 rounded-br-lg z-10 shadow-sm">
                  #1
                </div>
              </div>
              <div className="flex flex-col text-left pr-4">
                <span className="font-[800] text-[#0F172A] text-[14px] leading-tight mb-1">IIT Bombay</span>
                <div className="flex items-center gap-1">
                  <Star className="w-[12px] h-[12px] fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="text-[12px] font-bold text-[#64748B]">4.9</span>
                </div>
              </div>
            </div>

            {/* Floating Match Rate Card — pushed well outside text zone */}
            <div className="hidden xl:flex flex-col absolute bottom-24 -right-[260px] 2xl:-right-[320px] bg-white/80 backdrop-blur-md rounded-[16px] p-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 min-w-[160px] text-left hover:scale-105 hover:-translate-y-1 transition-all duration-300 z-30">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[32px] font-[900] text-[#0F172A] leading-none tracking-tight">98%</h3>
                <div className="w-[24px] h-[24px] bg-[#DCFCE7] rounded-full flex items-center justify-center text-[#16A34A] shrink-0">
                  <TrendingUp className="w-[14px] h-[14px] stroke-[3]" />
                </div>
              </div>
              <p className="text-[12px] font-[700] text-[#64748B] uppercase tracking-widest">Match Rate</p>
            </div>

            {/* Search Bar Container */}
            <div className="w-full max-w-[700px] relative z-20 mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[100px] bg-white p-2 flex items-center border border-slate-100 focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              <form action="/discover" className="flex items-center w-full h-[56px] pl-4">
                <Search className="w-6 h-6 text-[#94A3B8] shrink-0 mr-3" strokeWidth={2.5} />
                <input 
                  type="text" 
                  name="q"
                  placeholder="Search 12,000+ colleges, courses, cities..." 
                  className="flex-1 bg-transparent border-none outline-none text-[#0F172A] text-[16px] font-medium h-full placeholder:text-[#94A3B8]" 
                  required
                />
                <button type="submit" className="bg-gradient-to-r from-[#FF6B6B] to-[#EF4444] text-white font-[800] text-[15px] px-[32px] h-full rounded-[100px] hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all shrink-0 border-none outline-none">
                  Search Now
                </button>
              </form>
            </div>

            {/* Stream Filter Pills */}
            <div className="mt-[32px] flex flex-wrap justify-center gap-[12px] relative z-20">
              <Link href="/discover?stream=engineering" className="bg-[#4F46E5] text-white px-[24px] py-[10px] rounded-full font-[700] text-[14px] hover:shadow-md transition-all">
                Engineering
              </Link>
              <Link href="/discover?stream=mba" className="bg-white border border-[#E2E8F0] text-[#64748B] px-[24px] py-[10px] rounded-full font-[700] text-[14px] hover:border-[#94A3B8] hover:text-[#0F172A] transition-all">
                MBA
              </Link>
              <Link href="/discover?stream=medical" className="bg-white border border-[#E2E8F0] text-[#64748B] px-[24px] py-[10px] rounded-full font-[700] text-[14px] hover:border-[#94A3B8] hover:text-[#0F172A] transition-all">
                Medical
              </Link>
              <Link href="/discover?stream=design" className="bg-white border border-[#E2E8F0] text-[#64748B] px-[24px] py-[10px] rounded-full font-[700] text-[14px] hover:border-[#94A3B8] hover:text-[#0F172A] transition-all">
                Design
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="bg-white border-y border-[#F1F5F9] py-[40px] relative z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-8 sm:gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-[8px] h-[8px] rounded-full bg-[#10B981]"></div>
                <span className="text-[28px] font-[900] text-[#0F172A] leading-none tracking-tight">{(stats.totalColleges > 0 ? stats.totalColleges : 12000).toLocaleString()}+</span>
              </div>
              <span className="text-[14px] font-[600] text-[#64748B]">Colleges</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-[8px] h-[8px] rounded-full bg-[#10B981]"></div>
                <span className="text-[28px] font-[900] text-[#0F172A] leading-none tracking-tight">4.8M</span>
              </div>
              <span className="text-[14px] font-[600] text-[#64748B]">Students</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-[8px] h-[8px] rounded-full bg-[#10B981]"></div>
                <span className="text-[28px] font-[900] text-[#0F172A] leading-none tracking-tight">98%</span>
              </div>
              <span className="text-[14px] font-[600] text-[#64748B]">Match Accuracy</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-[8px] h-[8px] rounded-full bg-[#10B981]"></div>
                <span className="text-[28px] font-[900] text-[#0F172A] leading-none tracking-tight">{(stats.totalCourses > 0 ? stats.totalCourses : 2400).toLocaleString()}+</span>
              </div>
              <span className="text-[14px] font-[600] text-[#64748B]">Courses</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED COLLEGES */}
      <section className="bg-[#F8FAFC] py-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-[48px]">
            <h2 className="text-[36px] font-[900] text-[#0F172A] tracking-tight">Featured Colleges</h2>
            <Link href="/discover" className="text-[#EF4444] font-[800] hover:text-[#DC2626] flex items-center gap-1 text-[15px] transition-colors">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            {featuredColleges.map((college, idx) => (
              <CollegeCard
                key={college.id}
                rank={idx + 1}
                id={college.id}
                name={college.name}
                slug={college.slug}
                city={college.city}
                state={college.state}
                type={college.type}
                rating={college.rating}
                avgPackage={college.avgPackage}
                annualFees={college.annualFees}
                nirfRank={college.nirfRank}
                thumbnail={college.thumbnail}
                description={college.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CAMPUSPILOT */}
      <section className="bg-white py-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[36px] font-[900] text-[#0F172A] text-center mb-[64px] tracking-tight">
            Everything you need to choose confidently
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[24px] border border-[#F1F5F9] p-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-[56px] h-[56px] bg-[#EEF2FF] text-[#4F46E5] rounded-[16px] flex items-center justify-center mb-[24px]">
                <Sliders className="w-[28px] h-[28px] stroke-[2.5]" />
              </div>
              <h3 className="text-[20px] font-[800] text-[#0F172A] mb-3">Smart Search</h3>
              <p className="text-[15px] text-[#64748B] leading-relaxed mb-[32px] font-medium">
                Search across 12,000+ colleges by course, location, fees, rankings and more.
              </p>
              {/* Illustration SVG */}
              <div className="w-full h-[80px] bg-gradient-to-t from-indigo-50/50 to-transparent flex items-end justify-center rounded-b-xl border-b-2 border-indigo-500 overflow-hidden">
                 <svg className="w-[120%] h-[40px] text-indigo-400 opacity-50" viewBox="0 0 200 40" fill="none">
                    <path d="M-20 20 Q 20 40, 60 20 T 140 20 T 220 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                 </svg>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-[24px] border border-[#F1F5F9] p-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-[56px] h-[56px] bg-[#EEF2FF] text-[#4F46E5] rounded-[16px] flex items-center justify-center mb-[24px]">
                <GitCompare className="w-[28px] h-[28px] stroke-[2.5]" />
              </div>
              <h3 className="text-[20px] font-[800] text-[#0F172A] mb-3">Side-by-Side Compare</h3>
              <p className="text-[15px] text-[#64748B] leading-relaxed mb-[32px] font-medium">
                Compare up to 4 colleges instantly across 30+ data points at once.
              </p>
              {/* Illustration Table */}
              <div className="w-full h-[80px] flex flex-col gap-2 p-3 bg-slate-50 rounded-[12px] border border-slate-100">
                <div className="flex gap-2 h-4"><div className="w-1/3 bg-slate-200 rounded"></div><div className="w-1/3 bg-[#4F46E5]/20 rounded"></div><div className="w-1/3 bg-slate-200 rounded"></div></div>
                <div className="flex gap-2 h-4"><div className="w-1/3 bg-slate-200 rounded"></div><div className="w-1/3 bg-[#4F46E5]/20 rounded"></div><div className="w-1/3 bg-slate-200 rounded"></div></div>
                <div className="flex gap-2 h-4"><div className="w-1/3 bg-slate-200 rounded"></div><div className="w-1/3 bg-[#4F46E5]/20 rounded"></div><div className="w-1/3 bg-slate-200 rounded"></div></div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[24px] border border-[#F1F5F9] p-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-[56px] h-[56px] bg-[#EEF2FF] text-[#4F46E5] rounded-[16px] flex items-center justify-center mb-[24px]">
                <Sparkles className="w-[28px] h-[28px] stroke-[2.5]" />
              </div>
              <h3 className="text-[20px] font-[800] text-[#0F172A] mb-3">Personalised Match</h3>
              <p className="text-[15px] text-[#64748B] leading-relaxed mb-[32px] font-medium">
                Our AI matches you to colleges based on your grades, budget and goals.
              </p>
              {/* Illustration Donut */}
              <div className="w-full h-[80px] flex items-center justify-center bg-slate-50 rounded-[12px] border border-slate-100 relative">
                 <div className="absolute top-2 left-4 w-4 h-4 rounded-full bg-[#10B981]"></div>
                 <div className="absolute bottom-2 right-4 w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                 <div className="absolute top-4 right-8 w-3 h-3 rounded-full bg-[#EF4444]"></div>
                 <svg className="w-[60px] h-[60px]" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="20" fill="none" />
                   <circle cx="50" cy="50" r="40" stroke="#4F46E5" strokeWidth="20" fill="none" strokeDasharray="180 250" strokeLinecap="round"/>
                 </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPARE PREVIEW (Split view mapping the reference) */}
      <section className="bg-[#EEF2FF] py-[100px] border-t border-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-[32px] items-stretch">
            
            {/* LEFT SIDE TABLE */}
            <div className="w-full lg:w-[60%] flex">
              <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgb(0,0,0,0.06)] w-full flex flex-col">
                <div className="bg-[#4F46E5] px-[24px] py-[20px] grid grid-cols-5 gap-2 items-center">
                  <div className="text-[12px] font-[800] text-white/80 uppercase tracking-widest col-span-1">College</div>
                  <div className="text-[12px] font-[800] text-white uppercase tracking-widest col-span-1 text-center leading-tight">IIT<br/>Bombay</div>
                  <div className="text-[12px] font-[800] text-white uppercase tracking-widest col-span-1 text-center leading-tight">IIT<br/>Delhi</div>
                  <div className="text-[12px] font-[800] text-white uppercase tracking-widest col-span-1 text-center leading-tight">IIT<br/>Kanpur</div>
                  <div className="text-[12px] font-[800] text-white uppercase tracking-widest col-span-1 text-center leading-tight">IIT<br/>Madras</div>
                </div>
                <div className="divide-y divide-[#F1F5F9] flex-1 flex flex-col">
                  <div className="px-[24px] py-[20px] grid grid-cols-5 gap-2 items-center hover:bg-slate-50 transition-colors flex-1">
                    <div className="text-[13px] font-[700] text-[#64748B] col-span-1">Ranking</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">1</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">2</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">3</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">4</div>
                  </div>
                  <div className="px-[24px] py-[20px] grid grid-cols-5 gap-2 items-center hover:bg-slate-50 transition-colors flex-1">
                    <div className="text-[13px] font-[700] text-[#64748B] col-span-1">Fees ₹</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">₹2.0L</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">₹2.0L</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">₹2.0L</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">₹2.4L</div>
                  </div>
                  <div className="px-[24px] py-[20px] grid grid-cols-5 gap-2 items-center hover:bg-slate-50 transition-colors flex-1">
                    <div className="text-[13px] font-[700] text-[#64748B] col-span-1">Cut-off %</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">73.5</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">75.5</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">67.5</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">76.5</div>
                  </div>
                  <div className="px-[24px] py-[20px] grid grid-cols-5 gap-2 items-center hover:bg-slate-50 transition-colors flex-1">
                    <div className="text-[13px] font-[700] text-[#64748B] col-span-1">Reviews</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">450</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">450</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">425</div>
                    <div className="text-[15px] font-[800] text-[#0F172A] text-center">450</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE WIDGET */}
            <div className="w-full lg:w-[40%] flex">
              <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-[32px] shadow-[0_20px_40px_rgb(0,0,0,0.06)] flex flex-col w-full h-full justify-between">
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div className="relative w-[100px] h-[100px]">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="20" fill="none" strokeDasharray="100 251" />
                        <circle cx="50" cy="50" r="40" stroke="#3B82F6" strokeWidth="20" fill="none" strokeDasharray="80 251" strokeDashoffset="-100" />
                        <circle cx="50" cy="50" r="40" stroke="#EF4444" strokeWidth="20" fill="none" strokeDasharray="71 251" strokeDashoffset="-180" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-[900] text-[#0F172A] leading-tight">Admission<br/>Trends<br/>2025</h3>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <p className="text-[12px] font-[700] text-[#94A3B8] mb-[20px] tracking-wider uppercase">Average Package ₹LPA</p>
                  <div className="flex items-end gap-3 h-[120px]">
                    <div className="flex-1 bg-indigo-100 rounded-t-lg h-[35%] relative hover:bg-indigo-200 transition-colors">
                      <span className="absolute -top-7 w-full text-center text-[12px] font-bold text-[#64748B]">12</span>
                    </div>
                    <div className="flex-1 bg-indigo-200 rounded-t-lg h-[55%] relative hover:bg-indigo-300 transition-colors">
                      <span className="absolute -top-7 w-full text-center text-[12px] font-bold text-[#64748B]">18</span>
                    </div>
                    <div className="flex-1 bg-indigo-400 rounded-t-lg h-[75%] relative hover:bg-indigo-500 transition-colors">
                      <span className="absolute -top-7 w-full text-center text-[12px] font-bold text-[#0F172A]">24</span>
                    </div>
                    <div className="flex-1 bg-[#4F46E5] rounded-t-lg h-[100%] relative hover:bg-indigo-700 transition-colors shadow-lg">
                      <span className="absolute -top-7 w-full text-center text-[13px] font-bold text-[#0F172A]">32</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer is rendered by the (main)/layout.tsx — no duplicate needed here */}
    </div>
  );
}
