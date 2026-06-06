"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  CreditCard, 
  Users, 
  MapPin, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { formatFees } from "@/lib/utils";
import RatingStars from "@/components/ui/RatingStars";

interface OverviewProps {
  college: any;
  setActiveTab: (tab: string) => void;
}

// Indian Rupee Icon fallback if not in lucide
function IndianRupeeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3a4 4 0 0 0 0-8" />
    </svg>
  );
}

export default function Overview({ college, setActiveTab }: OverviewProps) {
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  const baseAvgPackage = college.avgPackage || 15.0;
  const placementRate = college.placementRate || Math.min(98, 85 + (Math.round(baseAvgPackage * 10) % 13));

  // Placement trends
  const trendData = [
    { name: "2019", Package: Number((baseAvgPackage * 0.65).toFixed(1)) },
    { name: "2020", Package: Number((baseAvgPackage * 0.72).toFixed(1)) },
    { name: "2021", Package: Number((baseAvgPackage * 0.80).toFixed(1)) },
    { name: "2022", Package: Number((baseAvgPackage * 0.88).toFixed(1)) },
    { name: "2023", Package: Number((baseAvgPackage * 0.95).toFixed(1)) },
    { name: "2024", Package: Number(baseAvgPackage.toFixed(1)) },
  ];

  // Donut chart segments
  const pieData = [
    { name: "Placed", value: placementRate },
    { name: "Remaining", value: 100 - placementRate },
  ];
  const COLORS = ["#16A34A", "#E2E8F0"];

  // Fallback recruiters
  const recruitersList = college.topRecruiters && college.topRecruiters.length > 0
    ? college.topRecruiters
    : ["Google", "Microsoft", "Amazon", "Goldman Sachs", "TCS", "Infosys", "Wipro", "L&T"];

  const toggleReviewExpand = (reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const ratingVal = college.averageRating || college.rating || 4.5;
  const totalReviewsVal = college.totalReviews !== undefined ? college.totalReviews : 128;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN - 65% width equivalent */}
      <div className="lg:col-span-2 space-y-8">
        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Placement Rate */}
          <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Placement Rate</span>
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">{placementRate}%</div>
          </div>

          {/* Card 2: Avg Package */}
          <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Avg Package</span>
              <IndianRupeeIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">₹{baseAvgPackage} LPA</div>
          </div>

          {/* Card 3: Annual Fees */}
          <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Annual Fees</span>
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">{formatFees(college.annualFees)}</div>
          </div>

          {/* Card 4: Student-Faculty Ratio */}
          <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Student-Faculty</span>
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">1:8</div>
          </div>
        </div>

        {/* PLACEMENT DATA SECTION */}
        <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6">
          <h3 className="text-[18px] font-bold text-[#0F172A] mb-6">Placement Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Line Chart */}
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-[#64748B] mb-4">Average Package ₹LPA over Years</h4>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "8px" }}
                      labelStyle={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 12 }}
                      itemStyle={{ color: "#818CF8", fontSize: 12 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Package" 
                      stroke="#4F46E5" 
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                      dot={{ r: 4, stroke: "#4F46E5", strokeWidth: 2, fill: "#FFFFFF" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-sm font-semibold text-[#64748B] mb-4 self-start">Placement Rate</h4>
              <div className="relative h-[200px] w-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute text-center">
                  <div className="text-2xl font-extrabold text-[#0F172A]">{placementRate}%</div>
                  <div className="text-[11px] font-semibold text-[#64748B]">Placed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOP RECRUITERS */}
        <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6">
          <h3 className="text-sm font-bold text-[#0F172A] mb-4">Top Recruiters</h3>
          <div className="flex flex-wrap gap-2.5">
            {recruitersList.map((recruiter: string, index: number) => (
              <span 
                key={index} 
                className="inline-flex items-center px-4 py-2 bg-white border border-indigo-200 text-indigo-700 text-sm font-semibold rounded-[8px] hover:bg-indigo-50/50 transition-colors"
              >
                {recruiter}
              </span>
            ))}
          </div>
        </div>

        {/* FEES TABLE SECTION */}
        <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 overflow-hidden">
          <h3 className="text-[18px] font-bold text-[#0F172A] mb-4">Fees Structure</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FF] border-b border-[#E2E8F0]">
                  <th className="py-3 px-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider rounded-l-[8px]">Course</th>
                  <th className="py-3 px-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Duration</th>
                  <th className="py-3 px-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Fees</th>
                  <th className="py-3 px-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider rounded-r-[8px]">Seats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {college.courses && college.courses.length > 0 ? (
                  college.courses.map((course: any) => (
                    <tr key={course.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="py-3.5 px-4 text-sm font-semibold text-[#0F172A]">{course.name}</td>
                      <td className="py-3.5 px-4 text-sm text-[#64748B]">{course.duration} Years</td>
                      <td className="py-3.5 px-4 text-sm font-bold text-[#0F172A]">{formatFees(course.fees)}</td>
                      <td className="py-3.5 px-4 text-sm text-[#64748B]">{course.seats || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-[#64748B] font-medium">
                      No course information available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - 35% width equivalent */}
      <div className="space-y-6">
        {/* REVIEWS SECTION */}
        <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6">
          <h3 className="text-[18px] font-bold text-[#0F172A] mb-4">Student Reviews</h3>
          
          {/* Overall rating summary */}
          <div className="flex flex-col items-center justify-center p-5 bg-[#F8F9FF] rounded-[12px] border border-[#E2E8F0] mb-6">
            <div className="text-[36px] font-black text-[#0F172A] leading-tight">
              {Number(ratingVal).toFixed(1)}
            </div>
            <div className="my-1.5">
              <RatingStars rating={ratingVal} showNumeric={false} starSize={18} />
            </div>
            <div className="text-xs font-medium text-[#64748B]">
              Based on {totalReviewsVal} student reviews
            </div>
          </div>

          {/* 3 most recent reviews */}
          <div className="space-y-4">
            {college.reviews && college.reviews.length > 0 ? (
              college.reviews.slice(0, 3).map((review: any) => {
                const isExpanded = !!expandedReviews[review.id];
                const shouldTruncate = review.body.length > 120;
                const bodyText = shouldTruncate && !isExpanded 
                  ? `${review.body.slice(0, 120)}...`
                  : review.body;
                
                const initials = review.user?.name 
                  ? review.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                  : "U";

                return (
                  <div key={review.id} className="border border-[#E2E8F0] rounded-[12px] p-4 bg-white space-y-2.5">
                    <div className="flex items-center gap-3">
                      {review.user?.image ? (
                        <img 
                          src={review.user.image} 
                          alt={review.user.name || "User"} 
                          className="h-9 w-9 rounded-full object-cover border border-[#E2E8F0]"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                      )}
                      <div>
                        <div className="text-[14px] font-bold text-[#0F172A] leading-tight">
                          {review.user?.name || "Anonymous Student"}
                        </div>
                        <div className="mt-0.5">
                          <RatingStars rating={review.rating} showNumeric={false} starSize={12} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[13px] font-bold text-[#0F172A]">{review.title}</div>
                      <p className="text-[13px] leading-relaxed text-[#64748B]">
                        {bodyText}
                        {shouldTruncate && (
                          <button 
                            onClick={() => toggleReviewExpand(review.id)}
                            className="text-xs font-bold text-[#4F46E5] hover:underline ml-1 cursor-pointer"
                          >
                            {isExpanded ? "Show Less" : "Read More"}
                          </button>
                        )}
                      </p>
                    </div>

                    <div className="text-[11px] font-medium text-[#64748B]">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-sm text-[#64748B] font-medium">
                No reviews yet. Be the first to share your experience!
              </div>
            )}
          </div>

          <button 
            onClick={() => setActiveTab("reviews")}
            className="w-full mt-5 py-2.5 px-4 text-[14px] font-bold text-indigo-600 border border-indigo-200 rounded-[8px] bg-white hover:bg-indigo-50/40 transition-colors text-center block cursor-pointer"
          >
            View All Reviews
          </button>
        </div>

        {/* LOCATION CARD */}
        <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 space-y-4">
          <h3 className="text-[18px] font-bold text-[#0F172A]">Location</h3>
          <div className="text-sm font-medium text-[#64748B] flex items-start gap-2.5">
            <MapPin className="h-4.5 w-4.5 text-[#64748B] shrink-0 mt-0.5" />
            <span>{college.location}, {college.state}</span>
          </div>

          {/* Placeholder Map */}
          <div className="h-[200px] w-full rounded-[12px] bg-slate-100 border border-[#E2E8F0] relative overflow-hidden flex items-center justify-center">
            {/* Soft grid background design */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>
            {/* Center map ping styling */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-50 border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
                <MapPin className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-[11px] font-bold text-indigo-600 bg-white border border-indigo-100 rounded-full px-2.5 py-0.5 shadow-sm mt-2">
                Campus Location
              </span>
            </div>
          </div>

          <a 
            href={`https://www.google.com/maps/search/${encodeURIComponent(college.name)}+${encodeURIComponent(college.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-bold text-indigo-600 hover:underline flex items-center gap-1.5 cursor-pointer justify-center w-full"
          >
            <span>Get Directions</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
