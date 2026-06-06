"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Compass,
  Search,
  GitCompare,
  Heart,
  Award,
  User,
  Settings,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userName?: string;
  userImage?: string;
}

export default function DashboardSidebar({ userName = "Aarav Sharma", userImage }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Discover", href: "/discover", icon: Compass },
    { name: "Search", href: "/discover", icon: Search },
    { name: "Compare", href: "/compare", icon: GitCompare },
    { name: "Saved", href: "/saved", icon: Heart },
    { name: "Scholarships", href: "/scholarships", icon: Award },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-[280px] bg-white border-r border-[#E2E8F0] h-screen sticky top-0 flex flex-col justify-between shrink-0 z-30">
      <div className="flex flex-col flex-1 pt-6 px-4">
        {/* Brand Logo */}
        <div className="px-3 mb-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-indigo-600">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span>CampusPilot</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-bold transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-200"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8F9FF]"
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] transition-colors",
                    isActive ? "text-white" : "text-[#94A3B8] group-hover:text-[#0F172A]"
                  )}
                  strokeWidth={2.2}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Sign Out Footer */}
      <div className="p-4 border-t border-[#E2E8F0] space-y-3">
        <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-[#F8F9FF] border border-[#F1F5F9]">
          <div className="flex items-center gap-3 min-w-0">
            {userImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={userImage}
                alt={userName}
                className="h-10 w-10 rounded-full object-cover border border-[#E2E8F0]"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold border border-indigo-200">
                {userName[0]?.toUpperCase() || "A"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold text-[#0F172A] truncate leading-tight">
                {userName}
              </p>
              <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">
                Student
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50/50 transition-colors duration-200 cursor-pointer"
        >
          <LogOut className="h-[16px] w-[16px]" strokeWidth={2.2} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
