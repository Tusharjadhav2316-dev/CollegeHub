import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import DiscoverClient from "./DiscoverClient";

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const state = typeof params.state === "string" ? params.state : "";
  const stream = typeof params.stream === "string" ? params.stream : "";

  let title = "Discover Colleges & Universities";

  if (stream && state) {
    const formatStream = stream.charAt(0).toUpperCase() + stream.slice(1);
    title = `Top ${formatStream} Colleges in ${state}`;
  } else if (stream) {
    const formatStream = stream.charAt(0).toUpperCase() + stream.slice(1);
    title = `Top ${formatStream} Colleges in India`;
  } else if (state) {
    title = `Colleges in ${state}`;
  } else if (search) {
    title = `Search results for "${search}"`;
  }

  return {
    title: `${title} — CampusPilot`,
    description: `Browse, filter and search ${title.toLowerCase()} across India by course stream, ranking, fees, location, and placement packages.`,
    alternates: {
      canonical: "https://campuspilot.in/discover",
    },
  };
}

interface PageProps {
 searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DiscoverPage({ searchParams }: PageProps) {
 const params = await searchParams;

 // Extract variables with fallbacks
 const search = typeof params.search === "string" ? params.search : "";
 const state = typeof params.state === "string" ? params.state : "";
 const stream = typeof params.stream === "string" ? params.stream : "";
 const type = typeof params.type === "string" ? params.type : "";
 const minFees = parseFloat(typeof params.minFees === "string" ? params.minFees : "0");
 const maxFees = parseFloat(typeof params.maxFees === "string" ? params.maxFees : "9999999");
 const minRating = parseFloat(typeof params.minRating === "string" ? params.minRating : "0");
 const nirfRank = parseInt(typeof params.nirfRank === "string" ? params.nirfRank : "0");
 const sort = typeof params.sort === "string" ? params.sort : "relevance";
 const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1"));
 const limit = 12; // default page size

 // Build Prisma where clause exactly as done in app/api/colleges/route.ts
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

 // 2. States Filter
 if (state) {
 const statesList = state.split(",").map((s) => s.trim()).filter(Boolean);
 if (statesList.length > 0) {
 andArray.push({
 state: { in: statesList, mode: "insensitive" },
 });
 }
 }

 // 3. Type Filter
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

 // 4. Stream / Course Filter
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
 orderBy = [
 { rating: "desc" },
 { avgPackage: "desc" },
 ];
 break;
 }

 // Pagination Calculations
 const skip = (page - 1) * limit;

 // Query Database
 const [collegesRaw, total] = await Promise.all([
 prisma.college.findMany({
 where,
 orderBy,
 skip,
 take: limit,
 }),
 prisma.college.count({ where }),
 ]);

 const colleges = collegesRaw.map((college) => ({
 ...college,
 avgRating: college.rating,
 }));

 const totalPages = Math.ceil(total / limit);

 return (
 <DiscoverClient
 colleges={colleges}
 total={total}
 currentPage={page}
 totalPages={totalPages}
 limit={limit}
 />
 );
}
