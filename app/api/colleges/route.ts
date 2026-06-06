import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse params
    const search = searchParams.get("search") || "";
    const state = searchParams.get("state") || "";
    const stream = searchParams.get("stream") || "";
    const type = searchParams.get("type") || "";
    const minFees = parseFloat(searchParams.get("minFees") || "0");
    const maxFees = parseFloat(searchParams.get("maxFees") || "9999999");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const nirfRank = parseInt(searchParams.get("nirfRank") || "0");
    const sort = searchParams.get("sort") || "relevance";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12"));

    // Build Prisma where clause
    const where: Prisma.CollegeWhereInput = { AND: [] };
    const andArray = where.AND as Prisma.CollegeWhereInput[];

    // 1. Search Query
    if (search) {
      andArray.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { state: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { type: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // 2. States Filter (Support comma-separated multi-select)
    if (state) {
      const statesList = state.split(",").map((s) => s.trim()).filter(Boolean);
      if (statesList.length > 0) {
        andArray.push({
          state: { in: statesList, mode: "insensitive" },
        });
      }
    }

    // 3. Type Filter (Govt, Private, Deemed, Autonomous)
    if (type) {
      const typesList = type.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
      if (typesList.length > 0) {
        const typeConditions = typesList.map((t) => {
          if (t === "govt" || t === "government") {
            return { type: { contains: "govt", mode: "insensitive" } };
          }
          return { type: { contains: t, mode: "insensitive" } };
        });
        andArray.push({
          OR: typeConditions as Prisma.CollegeWhereInput[],
        });
      }
    }

    // 4. Stream / Subject Filter (Engineering, MBA, Medical, etc.)
    if (stream) {
      const streamsList = stream.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (streamsList.length > 0) {
        const streamOrConditions: Prisma.CollegeWhereInput[] = [];

        streamsList.forEach((s) => {
          if (s.includes("engineering") || s.includes("technology")) {
            streamOrConditions.push({ courses: { some: { name: { in: ["B.Tech", "M.Tech", "PhD"] } } } });
            streamOrConditions.push({ type: { contains: "engineering", mode: "insensitive" } });
            streamOrConditions.push({ name: { contains: "technology", mode: "insensitive" } });
            streamOrConditions.push({ name: { contains: "iit", mode: "insensitive" } });
            streamOrConditions.push({ name: { contains: "nit", mode: "insensitive" } });
          } else if (s.includes("mba") || s.includes("management") || s.includes("business") || s.includes("commerce")) {
            streamOrConditions.push({ courses: { some: { name: { in: ["MBA", "BBA", "Executive MBA"] } } } });
            streamOrConditions.push({ type: { contains: "management", mode: "insensitive" } });
            streamOrConditions.push({ name: { contains: "iim", mode: "insensitive" } });
          } else if (s.includes("medical") || s.includes("health")) {
            streamOrConditions.push({ courses: { some: { name: { in: ["MBBS", "MD", "BDS"] } } } });
            streamOrConditions.push({ type: { contains: "medical", mode: "insensitive" } });
            streamOrConditions.push({ name: { contains: "aiims", mode: "insensitive" } });
          } else if (s.includes("design") || s.includes("fashion")) {
            streamOrConditions.push({ type: { contains: "design", mode: "insensitive" } });
            streamOrConditions.push({ name: { contains: "nid", mode: "insensitive" } });
            streamOrConditions.push({ name: { contains: "nift", mode: "insensitive" } });
          } else if (s.includes("law")) {
            streamOrConditions.push({ type: { contains: "law", mode: "insensitive" } });
            streamOrConditions.push({ name: { contains: "nlu", mode: "insensitive" } });
          } else if (s.includes("arts") || s.includes("humanities")) {
            streamOrConditions.push({ type: { contains: "arts", mode: "insensitive" } });
          } else if (s.includes("science")) {
            streamOrConditions.push({ courses: { some: { name: { in: ["B.Sc", "M.Sc"] } } } });
          }
        });

        if (streamOrConditions.length > 0) {
          andArray.push({
            OR: streamOrConditions,
          });
        }
      }
    }

    // 5. Fees Bounds
    if (minFees > 0 || maxFees < 9999999) {
      andArray.push({
        annualFees: {
          gte: minFees,
          lte: maxFees,
        },
      });
    }

    // 6. Rating Bounds
    if (minRating > 0) {
      andArray.push({
        rating: {
          gte: minRating,
        },
      });
    }

    // 7. NIRF Rank Upper Limit
    if (nirfRank > 0) {
      andArray.push({
        nirfRank: {
          not: null,
          lte: nirfRank,
        },
      });
    }

    // Build Sorting Clause
    let orderBy: Prisma.CollegeOrderByWithRelationInput[] = [];

    switch (sort.toLowerCase()) {
      case "name":
        orderBy = [{ name: "asc" }];
        break;
      case "fees":
      case "fees: low to high":
        orderBy = [{ annualFees: "asc" }];
        break;
      case "fees: high to low":
        orderBy = [{ annualFees: "desc" }];
        break;
      case "rating":
      case "rating: high to low":
        orderBy = [{ rating: "desc" }];
        break;
      case "placement":
      case "placement: high to low":
        orderBy = [{ avgPackage: "desc" }];
        break;
      case "ranking":
      case "ranking: best first":
        orderBy = [{ nirfRank: "asc" }];
        break;
      default:
        // Relevance default
        orderBy = [
          { rating: "desc" },
          { avgPackage: "desc" },
        ];
        break;
    }

    // Pagination Calculations
    const skip = (page - 1) * limit;

    // Fetch colleges and total count in parallel
    const [collegesRaw, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              courses: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.college.count({ where }),
    ]);

    // Format output objects to include derived ratings calculation if needed
    const colleges = collegesRaw.map((college) => ({
      ...college,
      // Since reviews have ratings, we return average rating. Fallback to college.rating if zero reviews.
      avgRating: college.rating,
    }));

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      colleges,
      total,
      page,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    });
  } catch (error) {
    console.error("Colleges GET API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
