import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import CollegeCard from "@/components/college/CollegeCard";
import HeroSection from "@/components/college/CollegeDetail/HeroSection";
import CollegeDetailClient from "@/components/college/CollegeDetail/CollegeDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCollegeData(slug: string) {
  const baseUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  // Try API fetch
  try {
    const res = await fetch(`${baseUrl}/api/colleges/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn("API fetch failed, falling back to direct Prisma lookup:", error);
  }

  // Fallback direct Prisma lookup
  const college = await prisma.college.findUnique({
    where: { slug },
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

  if (!college) return null;

  // Calculate review statistics
  const reviewStats = await prisma.review.aggregate({
    where: { collegeId: college.id },
    _avg: { rating: true },
    _count: { id: true },
  });

  const averageRating = reviewStats._avg.rating !== null ? Number(reviewStats._avg.rating.toFixed(1)) : null;
  const totalReviews = reviewStats._count.id;

  // Check if saved
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

  return {
    ...college,
    createdAt: college.createdAt.toISOString(),
    courses: college.courses.map(c => ({
      ...c,
    })),
    reviews: college.reviews.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    averageRating,
    totalReviews,
    isSaved,
  };
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const college = await getCollegeData(slug);
  if (!college) {
    return {
      title: "College Not Found | CampusPilot",
    };
  }
  return {
    title: `${college.name} — Fees, Courses, Placements | CampusPilot`,
    description: college.description.slice(0, 160),
    openGraph: {
      title: `${college.name} — Fees, Courses, Placements | CampusPilot`,
      description: college.description.slice(0, 160),
      images: [
        {
          url: college.banner || college.thumbnail || "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${college.name} — Fees, Courses, Placements | CampusPilot`,
      description: college.description.slice(0, 160),
      images: [college.banner || college.thumbnail || "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80"],
    },
  };
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const college = await getCollegeData(slug);

  if (!college) {
    notFound();
  }

  // Find stream
  let stream = "Engineering";
  const nameUpper = college.name.toUpperCase();
  const descUpper = college.description.toUpperCase();
  if (nameUpper.includes("MEDICAL") || nameUpper.includes("AIIMS") || descUpper.includes("MBBS")) {
    stream = "Medical";
  } else if (nameUpper.includes("MANAGEMENT") || nameUpper.includes("IIM") || nameUpper.includes("BUSINESS") || descUpper.includes("MBA")) {
    stream = "Management";
  }

  // Similar colleges logic
  const similarColleges = await prisma.college.findMany({
    where: {
      id: { not: college.id },
      OR: [
        { state: college.state },
        { type: college.type },
        { 
          annualFees: {
            gte: college.annualFees * 0.5,
            lte: college.annualFees * 1.5,
          }
        }
      ]
    },
    take: 3,
  });

  return (
    <div className="w-full bg-[#F8F9FF] min-h-screen pb-12">
      {/* BREADCRUMB NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="text-[13px] font-semibold flex flex-wrap items-center gap-1.5 text-[#64748B]">
          <Link href="/" className="hover:text-[#4F46E5] transition-colors">
            Home
          </Link>
          <span className="text-slate-400 font-medium">/</span>
          <Link href="/discover" className="hover:text-[#4F46E5] transition-colors">
            Discover
          </Link>
          <span className="text-slate-400 font-medium">/</span>
          <span className="text-[#64748B]">{stream}</span>
          <span className="text-slate-400 font-medium">/</span>
          <span className="text-[#0F172A] font-bold truncate max-w-[200px] sm:max-w-none">
            {college.name}
          </span>
        </nav>
      </div>

      {/* HERO SECTION */}
      <div className="mt-4">
        <HeroSection college={college} />
      </div>

      {/* CLIENT TABBED LAYOUT */}
      <CollegeDetailClient college={college} />

      {/* SIMILAR COLLEGES SECTION */}
      {similarColleges.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 pt-10 mt-6">
          <div className="mb-6">
            <h2 className="text-[24px] font-bold text-[#0F172A]">Similar Colleges You Might Like</h2>
            <p className="text-[#64748B] text-sm mt-0.5 font-medium">Based on stream, location, and fees range</p>
          </div>

          {/* Horizontal row list with mobile horizontal scrolling */}
          <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-none snap-x snap-mandatory lg:grid lg:grid-cols-3">
            {similarColleges.map((simCol) => (
              <div key={simCol.id} className="w-[300px] shrink-0 snap-start lg:w-auto">
                <CollegeCard
                  id={simCol.id}
                  name={simCol.name}
                  slug={simCol.slug}
                  city={simCol.city}
                  state={simCol.state}
                  type={simCol.type}
                  rating={simCol.rating}
                  avgPackage={simCol.avgPackage}
                  annualFees={simCol.annualFees}
                  nirfRank={simCol.nirfRank}
                  thumbnail={simCol.thumbnail}
                  description={simCol.description}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
