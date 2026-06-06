import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATIC_EXAMS = ["JEE Advanced", "JEE Mains", "NEET", "CAT", "GATE", "GMAT", "XAT"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    if (!q || q.trim().length < 1) {
      // Return empty categories and trending default
      const trending = await prisma.college.findMany({
        orderBy: [
          { nirfRank: "asc" },
          { avgPackage: "desc" },
        ],
        take: 4,
        select: {
          id: true,
          name: true,
          location: true,
          state: true,
          nirfRank: true,
          thumbnail: true,
          annualFees: true,
          slug: true,
        },
      });

      return NextResponse.json({
        colleges: [],
        courses: [],
        cities: [],
        exams: [],
        trending,
      });
    }

    const queryStr = q.trim();

    // Query in parallel
    const [collegesRaw, coursesRaw, citiesRaw, trending] = await Promise.all([
      // 1. Search Colleges by name
      prisma.college.findMany({
        where: {
          name: { contains: queryStr, mode: "insensitive" },
        },
        take: 4,
        select: {
          id: true,
          name: true,
          location: true,
          state: true,
          nirfRank: true,
          thumbnail: true,
          annualFees: true,
          slug: true,
        },
      }),

      // 2. Search Courses by name
      prisma.course.findMany({
        where: {
          name: { contains: queryStr, mode: "insensitive" },
        },
        take: 4,
        select: {
          id: true,
          name: true,
          collegeId: true,
          college: {
            select: {
              name: true,
            },
          },
        },
      }),

      // 3. Search Cities by matching city field in college records
      prisma.college.findMany({
        where: {
          city: { contains: queryStr, mode: "insensitive" },
        },
        select: {
          city: true,
        },
        distinct: ["city"],
        take: 4,
      }),

      // 4. Trending Colleges (Top 4 ranked or placed)
      prisma.college.findMany({
        orderBy: [
          { nirfRank: "asc" },
          { avgPackage: "desc" },
        ],
        take: 4,
        select: {
          id: true,
          name: true,
          location: true,
          state: true,
          nirfRank: true,
          thumbnail: true,
          annualFees: true,
          slug: true,
        },
      }),
    ]);

    // Map courses to match the required object structure
    const courses = coursesRaw.map((c) => ({
      id: c.id,
      name: c.name,
      collegeId: c.collegeId,
      collegeName: c.college.name,
    }));

    // Map cities list
    const cities = citiesRaw
      .map((c) => c.city)
      .filter((c): c is string => !!c && c.trim().length > 0);

    // Filter exams containing search query
    const exams = STATIC_EXAMS.filter((exam) =>
      exam.toLowerCase().includes(queryStr.toLowerCase())
    );

    return NextResponse.json({
      colleges: collegesRaw,
      courses,
      cities,
      exams,
      trending,
    });
  } catch (error) {
    console.error("Smart Search API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
