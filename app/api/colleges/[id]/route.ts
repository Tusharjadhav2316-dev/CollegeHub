import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // First try by slug
    let college = await prisma.college.findUnique({
      where: { slug: id },
      include: {
        courses: true,
        reviews: {
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
          take: 10,
        },
        _count: {
          select: {
            savedBy: true,
          },
        },
      },
    });

    // If not found by slug, try by ID
    if (!college) {
      college = await prisma.college.findUnique({
        where: { id },
        include: {
          courses: true,
          reviews: {
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
            take: 10,
          },
          _count: {
            select: {
              savedBy: true,
            },
          },
        },
      });
    }

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    // Calculate averageRating and totalReviews
    const reviewStats = await prisma.review.aggregate({
      where: { collegeId: college.id },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    const averageRating = reviewStats._avg.rating !== null ? Number(reviewStats._avg.rating.toFixed(1)) : null;
    const totalReviews = reviewStats._count.id;

    // Check if saved by current user
    let isSaved = false;
    const session = await auth();
    if (session && session.user && session.user.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) {
        const savedRecord = await prisma.savedCollege.findUnique({
          where: {
            userId_collegeId: {
              userId: dbUser.id,
              collegeId: college.id,
            },
          },
        });
        isSaved = !!savedRecord;
      }
    }

    // Construct response object
    const responseData = {
      ...college,
      averageRating,
      totalReviews,
      isSaved,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching college details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
