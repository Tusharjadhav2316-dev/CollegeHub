import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");

  // Validate: must have ids
  if (!idsParam || idsParam.trim() === "") {
    return NextResponse.json(
      { error: "Missing required query parameter: ids" },
      { status: 400 }
    );
  }

  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  // Validate: 2–4 colleges
  if (ids.length < 2) {
    return NextResponse.json(
      { error: "At least 2 college IDs are required for comparison" },
      { status: 400 }
    );
  }
  if (ids.length > 3) {
    return NextResponse.json(
      { error: "Maximum 3 colleges for comparison" },
      { status: 400 }
    );
  }

  try {
    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        state: true,
        type: true,
        rating: true,
        annualFees: true,
        avgPackage: true,
        nirfRank: true,
        thumbnail: true,
        description: true,
        location: true,
        courses: {
          select: {
            id: true,
            name: true,
            duration: true,
            fees: true,
            seats: true,
          },
          orderBy: { fees: "asc" },
          take: 10,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (colleges.length === 0) {
      return NextResponse.json(
        { error: "No colleges found for the provided IDs" },
        { status: 404 }
      );
    }

    // Preserve order matching the requested ids array
    const ordered = ids
      .map((id) => colleges.find((c) => c.id === id))
      .filter(Boolean);

    // Compute highlight hints (best value per numeric row)
    // bestNirf = lowest rank number wins (smaller = better)
    // bestFees = lowest fees wins
    // bestPackage = highest package wins
    // bestRating = highest rating wins
    const validNirf = ordered
      .map((c) => c!.nirfRank)
      .filter((n): n is number => n !== null && n !== undefined);
    const validFees = ordered.map((c) => c!.annualFees).filter(Boolean);
    const validPackage = ordered.map((c) => c!.avgPackage).filter(Boolean);
    const validRating = ordered.map((c) => c!.rating).filter(Boolean);

    const highlights = {
      bestNirfRank: validNirf.length > 0 ? Math.min(...validNirf) : null,
      bestAnnualFees: validFees.length > 0 ? Math.min(...validFees) : null,
      bestAvgPackage: validPackage.length > 0 ? Math.max(...validPackage) : null,
      bestRating: validRating.length > 0 ? Math.max(...validRating) : null,
    };

    return NextResponse.json({
      colleges: ordered,
      highlights,
      meta: {
        count: ordered.length,
        requestedIds: ids,
      },
    });
  } catch (error) {
    console.error("[API /compare] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch college data for comparison" },
      { status: 500 }
    );
  }
}
