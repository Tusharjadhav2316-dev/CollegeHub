import { prisma } from "./prisma";

export interface HomepageStats {
  totalColleges: number;
  totalCourses: number;
  statesCovered: number;
  avgRating: number;
}

export async function getHomepageStats(): Promise<HomepageStats> {
  try {
    const [totalColleges, totalCourses, stateAgg, ratingAgg] = await Promise.all([
      prisma.college.count(),
      prisma.course.count(),
      prisma.college.findMany({
        select: { state: true },
        distinct: ["state"],
      }),
      prisma.college.aggregate({
        _avg: {
          rating: true,
        },
      }),
    ]);

    const avgRatingRaw = ratingAgg._avg.rating ?? 0;
    const avgRating = Math.round(avgRatingRaw * 10) / 10;

    return {
      totalColleges,
      totalCourses,
      statesCovered: stateAgg.length,
      avgRating,
    };
  } catch (error) {
    console.error("Failed to fetch homepage stats:", error);
    return {
      totalColleges: 0,
      totalCourses: 0,
      statesCovered: 0,
      avgRating: 0.0,
    };
  }
}
