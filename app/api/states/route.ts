import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const states = await prisma.college.findMany({
      select: {
        state: true,
      },
      distinct: ["state"],
      orderBy: {
        state: "asc",
      },
    });

    const stateList = states
      .map((s) => s.state)
      .filter((s): s is string => !!s && s.trim().length > 0);

    return NextResponse.json(stateList);
  } catch (error) {
    console.error("Failed to fetch states list:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
