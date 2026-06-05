import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

function parseCsvLine(line: string): string[] {
  const row: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  row.push(current.trim());
  return row;
}

function generateCourses(type: string, annualFees: number) {
  const t = type.toLowerCase();
  const courses: { name: string; duration: number; fees: number; seats: number }[] = [];

  if (
    t.includes("iit") ||
    t.includes("nit") ||
    t.includes("iiit") ||
    t.includes("bits") ||
    t.includes("engineering")
  ) {
    courses.push({ name: "B.Tech", duration: 4, fees: annualFees, seats: 120 });
    courses.push({ name: "M.Tech", duration: 2, fees: Math.round(annualFees * 0.8), seats: 60 });
    courses.push({ name: "PhD", duration: 3, fees: Math.round(annualFees * 0.5), seats: 15 });
  } else if (t.includes("iim") || t.includes("management")) {
    courses.push({ name: "MBA", duration: 2, fees: annualFees, seats: 180 });
    courses.push({ name: "BBA", duration: 3, fees: Math.round(annualFees * 0.7), seats: 120 });
    courses.push({ name: "Executive MBA", duration: 1, fees: Math.round(annualFees * 1.2), seats: 45 });
  } else if (t.includes("aiims") || t.includes("medical")) {
    courses.push({ name: "MBBS", duration: 5, fees: annualFees, seats: 100 });
    courses.push({ name: "MD", duration: 3, fees: Math.round(annualFees * 1.5), seats: 30 });
    courses.push({ name: "BDS", duration: 4, fees: Math.round(annualFees * 0.8), seats: 50 });
  } else {
    courses.push({ name: "BCA", duration: 3, fees: annualFees, seats: 120 });
    courses.push({ name: "MCA", duration: 2, fees: Math.round(annualFees * 1.1), seats: 60 });
    courses.push({ name: "B.Sc", duration: 3, fees: Math.round(annualFees * 0.5), seats: 150 });
    courses.push({ name: "M.Sc", duration: 2, fees: Math.round(annualFees * 0.6), seats: 80 });
  }

  return courses;
}

async function main() {
  console.log("Cleaning database...");
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  const csvPath = path.join(process.cwd(), "datasets", "india_colleges.csv");
  console.log(`Reading dataset from: ${csvPath}`);

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at ${csvPath}`);
  }

  const data = fs.readFileSync(csvPath, "utf-8");
  const lines = data.split(/\r?\n/).filter((line) => line.trim() !== "");

  const uniqueNames = new Set<string>();
  const uniqueSlugs = new Set<string>();
  let importedCount = 0;

  console.log(`Parsing ${lines.length - 1} records from CSV...`);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row = parseCsvLine(line);

    if (row.length < 8) {
      continue;
    }

    const [nameRaw, cityRaw, stateRaw, typeRaw, feesRaw, placementRaw, ratingRaw, nirfRaw] = row;

    const name = nameRaw.replace(/^"|"$/g, "").trim();
    if (uniqueNames.has(name)) {
      continue;
    }
    uniqueNames.add(name);

    let slug = slugify(name);
    // Ensure slug uniqueness
    let slugCounter = 1;
    const baseSlug = slug;
    while (uniqueSlugs.has(slug)) {
      slug = `${baseSlug}-${slugCounter}`;
      slugCounter++;
    }
    uniqueSlugs.add(slug);

    const city = cityRaw.replace(/^"|"$/g, "").trim() || null;
    const state = stateRaw.replace(/^"|"$/g, "").trim();
    const location = city ? `${city}, ${state}` : state;
    const type = typeRaw.replace(/^"|"$/g, "").trim();
    const annualFees = parseFloat(feesRaw) || 0;
    const avgPackage = parseFloat(placementRaw) || 0;
    const rating = parseFloat(ratingRaw) || 0;
    const nirfRank = parseInt(nirfRaw, 10) || null;

    const thumbnail = `https://picsum.photos/seed/${slug}/800/600`;
    const description = `${name} is a premier ${type} institution located in ${location}. Known for academic excellence and career success, it offers a robust curriculum and strong placements with an average package of ${avgPackage} LPA.`;

    const generatedCourses = generateCourses(type, annualFees);

    await prisma.college.create({
      data: {
        name,
        slug,
        city,
        state,
        location,
        type,
        annualFees,
        avgPackage,
        rating,
        nirfRank,
        thumbnail,
        description,
        courses: {
          create: generatedCourses,
        },
      },
    });

    importedCount++;
    if (importedCount % 100 === 0) {
      console.log(`Imported ${importedCount} colleges...`);
    }
  }

  console.log(`Database seeding completed. Successfully imported ${importedCount} colleges.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
