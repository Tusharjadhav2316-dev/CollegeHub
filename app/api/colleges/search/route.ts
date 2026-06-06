import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ success: true, colleges: [] });
    }

    const colleges = await prisma.college.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { state: { contains: query, mode: "insensitive" } },
          { type: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        state: true,
        thumbnail: true,
        type: true,
        rating: true,
        annualFees: true,
        avgPackage: true,
        nirfRank: true,
      },
    });

    return NextResponse.json({ success: true, colleges });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
