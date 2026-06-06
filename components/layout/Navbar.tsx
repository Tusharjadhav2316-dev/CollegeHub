"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Heart,
  Compass,
  BarChart3,
  GraduationCap,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, children, active, onClick }: NavLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "relative py-2 px-1 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-md",
      active
        ? "text-indigo-600 dark:text-indigo-400"
        : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
    )}
  >
    {children}
    {active && (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
    )}
  </Link>
);

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Discover", href: "/discover", icon: Compass },
    { name: "Compare", href: "/compare", icon: GraduationCap },
    { name: "Rankings", href: "/rankings", icon: BarChart3 },
    { name: "Scholarships", href: "/scholarships", icon: GraduationCap },
  ];

  const isLoading = status === "loading";
  const isLoggedIn = !!session?.user;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:bg-indigo-500 dark:shadow-none">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span>CampusPilot</span>
            </Link>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                active={pathname === item.href}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            ) : isLoggedIn ? (
              /* User Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {session.user?.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User profile"}
                      className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-bold">
                      {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 focus:outline-none">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/saved"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Heart className="h-4 w-4 text-rose-500" />
                        Saved Colleges
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Signup Buttons */
              <>
                <Link href="/login">
                  <Button variant="ghost" className="h-9 px-4">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="h-9 px-4">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-45 md:hidden transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Slide-in Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm bg-white dark:bg-slate-950 p-6 shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 mb-6 shrink-0">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-lg font-extrabold text-indigo-600 dark:text-indigo-400"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span>CampusPilot</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col space-y-1.5 overflow-y-auto flex-1 pr-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold transition-colors",
                pathname === item.href
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              )}
            >
              <item.icon className="h-5 w-5 text-indigo-500/80" />
              {item.name}
            </Link>
          ))}

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 space-y-5">
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  {session.user?.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User profile"}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-bold">
                      {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {session.user?.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {session.user?.email}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    <LayoutDashboard className="h-5 w-5 text-slate-400" />
                    Dashboard
                  </Link>
                  <Link
                    href="/saved"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    <Heart className="h-5 w-5 text-rose-500" />
                    Saved Colleges
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 text-left cursor-pointer"
                  >
                    <LogOut className="h-5 w-5 text-red-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="ghost" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                  <Button className="w-full justify-center">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
