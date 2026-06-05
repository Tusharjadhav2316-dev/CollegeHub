import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [totalColleges, totalCourses, stateAgg, ratingAgg] = await Promise.all([
      prisma.college.count(),
      prisma.course.count(),
      prisma.college.findMany({
        select: { state: true },
        distinct: ["state"],
      }),
      prisma.college.aggregate({
        _avg: { rating: true },
      }),
    ]);

    const totalStates = stateAgg.length;
    const avgRating = ratingAgg._avg.rating ?? 0;

    return NextResponse.json({
      totalColleges,
      totalCourses,
      totalStates,
      avgRating: Math.round(avgRating * 10) / 10,
    });
  } catch (error) {
    console.error("[api/stats] Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
