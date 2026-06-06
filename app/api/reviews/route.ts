import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");
    const pageStr = searchParams.get("page") || "1";
    const page = Math.max(1, parseInt(pageStr, 10));
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!collegeId) {
      return NextResponse.json(
        { error: "collegeId is required" },
        { status: 400 }
      );
    }

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { collegeId },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { collegeId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Please login to write a review" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { collegeId, rating, title, body: reviewBody } = body;

    // Validation
    if (!collegeId) {
      return NextResponse.json({ error: "collegeId is required" }, { status: 400 });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json({ error: "Title must be at least 3 characters" }, { status: 400 });
    }
    if (!reviewBody || typeof reviewBody !== "string" || reviewBody.trim().length < 50) {
      return NextResponse.json({ error: "Review body must be at least 50 characters" }, { status: 400 });
    }

    // Get user from DB
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });
    if (!collegeExists) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Check for duplicate review
    const duplicate = await prisma.review.findFirst({
      where: {
        userId: dbUser.id,
        collegeId,
      },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "You have already reviewed this college" },
        { status: 400 }
      );
    }

    // Create review
    const newReview = await prisma.review.create({
      data: {
        rating: parseFloat(rating.toFixed(1)),
        title: title.trim(),
        body: reviewBody.trim(),
        userId: dbUser.id,
        collegeId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Reviews POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
