import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper to authenticate user from session
async function getAuthenticatedUser() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return null;
  }
  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

// GET: Retrieve all saved colleges for the current user
export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please login to view saved colleges" },
        { status: 401 }
      );
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: user.id },
      include: {
        college: {
          include: {
            _count: {
              select: {
                courses: true,
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: {
        savedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      savedColleges: savedColleges.map((s) => s.college),
    });
  } catch (error) {
    console.error("Save GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Save a college
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please login to save colleges" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { collegeId } = body;

    if (!collegeId) {
      return NextResponse.json(
        { error: "collegeId is required" },
        { status: 400 }
      );
    }

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });
    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    // Check if already saved
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: user.id,
          collegeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "College already saved" },
        { status: 400 }
      );
    }

    // Save relation
    const saved = await prisma.savedCollege.create({
      data: {
        userId: user.id,
        collegeId,
      },
      include: {
        college: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "College saved!", saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a saved college
export async function DELETE(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please login to manage saved colleges" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { collegeId } = body;

    if (!collegeId) {
      return NextResponse.json(
        { error: "collegeId is required" },
        { status: 400 }
      );
    }

    // Check if saved
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: user.id,
          collegeId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "College not saved" },
        { status: 400 }
      );
    }

    // Delete relation
    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: user.id,
          collegeId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Removed from saved",
    });
  } catch (error) {
    console.error("Save DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
