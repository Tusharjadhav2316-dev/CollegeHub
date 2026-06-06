"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { formatFees } from "@/lib/utils";

interface Course {
  id: string;
  name: string;
  duration: number;
  fees: number;
  seats?: number | null;
}

interface CoursesProps {
  courses: Course[];
  collegeName: string;
}

export default function Courses({ courses, collegeName }: CoursesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const groupedCourses = useMemo(() => {
    const groups: Record<string, Course[]> = {};

    filteredCourses.forEach((course) => {
      const name = course.name.toUpperCase();
      let groupName = "Other Programs";

      if (name.includes("B.TECH") || name.includes("B.E.") || name.includes("BACHELOR OF TECHNOLOGY")) {
        groupName = "B.Tech Programs";
      } else if (name.includes("M.TECH") || name.includes("M.E.") || name.includes("MASTER OF TECHNOLOGY")) {
        groupName = "M.Tech Programs";
      } else if (name.includes("MBA") || name.includes("MASTER OF BUSINESS")) {
        groupName = "Management Programs (MBA)";
      } else if (name.includes("PH.D") || name.includes("PHD") || name.includes("DOCTOR OF")) {
        groupName = "Doctoral Programs (Ph.D)";
      } else if (name.includes("M.SC") || name.includes("B.SC") || name.includes("SCIENCE")) {
        groupName = "Sciences Programs";
      }

      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(course);
    });

    return groups;
  }, [filteredCourses]);

  const groupKeys = Object.keys(groupedCourses);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-bold text-[#0F172A]">Courses and Fees</h2>
          <p className="text-[#64748B] text-sm mt-0.5 font-medium">All programs offered at {collegeName}</p>
        </div>

        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-[10px] text-sm text-[#0F172A] placeholder-[#64748B] bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-colors font-medium shadow-sm"
          />
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#E2E8F0] rounded-[12px]">
          <p className="text-sm font-semibold text-[#64748B]">No course information available</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#E2E8F0] rounded-[12px]">
          <p className="text-sm font-semibold text-[#64748B]">No programs match your search query</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupKeys.map((groupName) => (
            <div key={groupName} className="space-y-4">
              <h3 className="text-lg font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
                {groupName} ({groupedCourses[groupName].length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedCourses[groupName].map((course) => (
                  <div 
                    key={course.id} 
                    className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 hover:shadow-md transition-shadow duration-200 flex justify-between items-start"
                  >
                    <div className="space-y-2 max-w-[70%]">
                      <h4 className="text-[16px] font-bold text-[#0F172A] leading-snug">{course.name}</h4>
                      <p className="text-xs font-semibold text-[#64748B] bg-[#F8F9FF] border border-[#E2E8F0] rounded-full px-2.5 py-0.5 inline-block">
                        Duration: {course.duration} Years
                      </p>
                    </div>
                    
                    <div className="text-right space-y-1.5 shrink-0">
                      <div className="text-[16px] font-extrabold text-[#0F172A]">
                        {formatFees(course.fees)}
                      </div>
                      <div className="text-[11px] font-semibold text-[#64748B]">
                        Seats: {course.seats || "—"}
                      </div>
                      <a 
                        href="#" 
                        className="text-xs font-bold text-[#4F46E5] hover:underline block pt-1"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Details for ${course.name} will be added soon!`);
                        }}
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
