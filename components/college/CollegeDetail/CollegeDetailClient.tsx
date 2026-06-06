"use client";

import React, { useState } from "react";
import TabNav from "./TabNav";
import Overview from "./Overview";
import Courses from "./Courses";
import Placements from "./Placements";
import Reviews from "./Reviews";
import { ClipboardCheck, Sparkles, Image as ImageIcon } from "lucide-react";

interface CollegeDetailClientProps {
  college: any;
}

export default function CollegeDetailClient({ college }: CollegeDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview college={college} setActiveTab={setActiveTab} />;
      case "courses":
        return <Courses courses={college.courses || []} collegeName={college.name} />;
      case "placements":
        return <Placements college={college} />;
      case "reviews":
        return (
          <Reviews 
            collegeId={college.id} 
            collegeSlug={college.slug} 
            initialReviews={college.reviews || []} 
            totalCount={college.totalReviews || (college.reviews?.length || 0)} 
          />
        );
      case "admissions":
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm my-6">
            <div className="h-16 w-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto text-[#4F46E5]">
              <ClipboardCheck className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0F172A]">Admissions</h3>
              <p className="text-sm text-[#64748B] leading-relaxed font-medium">
                Coming soon — full data for Admissions including application deadlines, criteria, and documentation will be available soon.
              </p>
            </div>
          </div>
        );
      case "cutoffs":
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm my-6">
            <div className="h-16 w-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto text-[#4F46E5]">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0F172A]">Cutoffs</h3>
              <p className="text-sm text-[#64748B] leading-relaxed font-medium">
                Coming soon — full data for Cutoffs including previous year trends, streams, and category benchmarks will be available soon.
              </p>
            </div>
          </div>
        );
      case "gallery":
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm my-6">
            <div className="h-16 w-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto text-[#4F46E5]">
              <ImageIcon className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0F172A]">Gallery</h3>
              <p className="text-sm text-[#64748B] leading-relaxed font-medium">
                Coming soon — full data for Gallery including campus views, labs, hostels, and sports grounds will be available soon.
              </p>
            </div>
          </div>
        );
      default:
        return <Overview college={college} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="space-y-2">
      {/* Sticky Tab Navigation */}
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Tab Content Section */}
      <div id="college-tab-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
}
