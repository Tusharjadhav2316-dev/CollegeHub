import React from "react";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/dashboard/DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — CampusPilot",
  description:
    "Review your top matched colleges, tracked applications, recommended deadlines, and compare metrics to choose your future campus.",
};

export default async function DashboardPage() {
  // Enforce authentication
  const user = await requireAuth();

  // Query actual saved count
  const savedCount = await prisma.savedCollege.count({
    where: { userId: user.id },
  });

  // Query top matches (3 colleges)
  const topColleges = await prisma.college.findMany({
    orderBy: [
      { rating: "desc" },
      { nirfRank: "asc" }
    ],
    take: 3,
  });

  // Query average packages (top 5 colleges)
  const chartColleges = await prisma.college.findMany({
    orderBy: { avgPackage: "desc" },
    take: 5,
  });

  // Query colleges for recommended deadlines (4 colleges)
  const deadlineColleges = await prisma.college.findMany({
    orderBy: { name: "asc" },
    take: 4,
  });

  // Transform user data safely to pass to client component
  const clientUser = {
    name: user.name || null,
    email: user.email || "",
    image: user.image || null,
  };

  return (
    <DashboardClient
      user={clientUser}
      savedCount={savedCount}
      topColleges={topColleges}
      chartColleges={chartColleges}
      deadlineColleges={deadlineColleges}
    />
  );
}
