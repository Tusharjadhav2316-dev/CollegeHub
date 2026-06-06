"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FF] text-[#0F172A]">
      {!isDashboard && <Navbar />}
      <main className="flex-1 w-full">{children}</main>
      {!isDashboard && <Footer />}
    </div>
  );
}

