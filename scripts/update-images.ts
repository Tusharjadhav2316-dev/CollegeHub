import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Image URLs defined in prompt rules
const IMAGES_ENG = [
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
];

const IMAGES_MED = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80",
];

const IMAGES_MBA = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
];

const IMAGES_LAW = [
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
];

const IMAGES_DES = [
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
];

const IMAGES_SCI = [
  "https://images.unsplash.com/photo-1532094349884-543559563f4c?w=800&q=80",
  "https://images.unsplash.com/photo-1576319155264-99536e0be1ee?w=800&q=80",
];

const IMAGES_OTH = [
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
  "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=800&q=80",
  "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=800&q=80",
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
  "https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&q=80",
  "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800&q=80",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80",
];

async function main() {
  console.log("Fetching colleges with their courses...");
  const colleges = await prisma.college.findMany({
    include: {
      courses: true,
    },
  });

  console.log(`Analyzing and updating ${colleges.length} colleges...`);

  // Category rotation counters
  let countEng = 0;
  let countMed = 0;
  let countMba = 0;
  let countLaw = 0;
  let countDes = 0;
  let countSci = 0;
  let countOth = 0;

  let totalUpdated = 0;

  for (const college of colleges) {
    const name = college.name.toLowerCase();
    const type = college.type.toLowerCase();
    const desc = college.description.toLowerCase();
    const courseNames = college.courses.map((c) => c.name.toLowerCase());

    let selectedThumbnail = "";

    // 1. Engineering / Technology
    const isEng =
      name.includes("iit") ||
      name.includes("nit") ||
      name.includes("iiit") ||
      name.includes("bits") ||
      name.includes("engineering") ||
      name.includes("technology") ||
      type.includes("iit") ||
      type.includes("nit") ||
      type.includes("iiit") ||
      type.includes("bits") ||
      type.includes("engineering") ||
      type.includes("technology") ||
      desc.includes("engineering") ||
      desc.includes("technology") ||
      courseNames.some((c) => c.includes("b.tech") || c.includes("m.tech") || c.includes("phd"));

    // 2. Medical / Medicine / Pharmacy
    const isMed =
      name.includes("aiims") ||
      name.includes("medical") ||
      name.includes("medicine") ||
      name.includes("pharmacy") ||
      name.includes("dental") ||
      name.includes("nursing") ||
      type.includes("aiims") ||
      type.includes("medical") ||
      type.includes("medicine") ||
      type.includes("pharmacy") ||
      type.includes("dental") ||
      type.includes("nursing") ||
      desc.includes("medical") ||
      desc.includes("medicine") ||
      desc.includes("pharmacy") ||
      desc.includes("dental") ||
      desc.includes("nursing") ||
      desc.includes("aiims") ||
      courseNames.some((c) => c.includes("mbbs") || c.includes("md") || c.includes("bds") || c.includes("pharm") || c.includes("nursing"));

    // 3. MBA / Management / Business
    const isMba =
      name.includes("iim") ||
      name.includes("management") ||
      name.includes("business") ||
      name.includes("commerce") ||
      type.includes("iim") ||
      type.includes("management") ||
      type.includes("business") ||
      type.includes("commerce") ||
      desc.includes("management") ||
      desc.includes("business") ||
      desc.includes("commerce") ||
      desc.includes("iim") ||
      desc.includes("mba") ||
      desc.includes("bba") ||
      courseNames.some((c) => c.includes("mba") || c.includes("bba"));

    // 4. Law
    const isLaw =
      name.includes("law") ||
      name.includes("nlu") ||
      type.includes("law") ||
      type.includes("nlu") ||
      desc.includes("law") ||
      desc.includes("nlu");

    // 5. Design / Arts / Architecture
    const isDes =
      name.includes("design") ||
      name.includes("arts") ||
      name.includes("architecture") ||
      name.includes("fashion") ||
      name.includes("nid") ||
      name.includes("nift") ||
      type.includes("design") ||
      type.includes("arts") ||
      type.includes("architecture") ||
      type.includes("fashion") ||
      desc.includes("design") ||
      desc.includes("arts") ||
      desc.includes("architecture") ||
      desc.includes("fashion");

    // 6. Science / Research
    const isSci =
      name.includes("science") ||
      name.includes("research") ||
      name.includes("iisc") ||
      type.includes("science") ||
      type.includes("research") ||
      desc.includes("science") ||
      desc.includes("research") ||
      courseNames.some((c) => c.includes("b.sc") || c.includes("m.sc"));

    // Assign URLs based on priority matching
    if (isEng) {
      selectedThumbnail = IMAGES_ENG[countEng % IMAGES_ENG.length];
      countEng++;
    } else if (isMed) {
      selectedThumbnail = IMAGES_MED[countMed % IMAGES_MED.length];
      countMed++;
    } else if (isMba) {
      selectedThumbnail = IMAGES_MBA[countMba % IMAGES_MBA.length];
      countMba++;
    } else if (isLaw) {
      selectedThumbnail = IMAGES_LAW[countLaw % IMAGES_LAW.length];
      countLaw++;
    } else if (isDes) {
      selectedThumbnail = IMAGES_DES[countDes % IMAGES_DES.length];
      countDes++;
    } else if (isSci) {
      selectedThumbnail = IMAGES_SCI[countSci % IMAGES_SCI.length];
      countSci++;
    } else {
      selectedThumbnail = IMAGES_OTH[countOth % IMAGES_OTH.length];
      countOth++;
    }

    // Set banner as thumbnail replacing w=800 with w=1200
    const selectedBanner = selectedThumbnail.replace("w=800", "w=1200");

    // Update Prisma College record
    await prisma.college.update({
      where: { id: college.id },
      data: {
        thumbnail: selectedThumbnail,
        banner: selectedBanner,
      },
    });

    totalUpdated++;
    if (totalUpdated % 50 === 0) {
      console.log(`Updated ${totalUpdated} colleges...`);
    }
  }

  console.log(`\nUpdate finished!`);
  console.log(`- Total Engineering updated: ${countEng}`);
  console.log(`- Total Medical/Pharmacy updated: ${countMed}`);
  console.log(`- Total MBA/Management updated: ${countMba}`);
  console.log(`- Total Law updated: ${countLaw}`);
  console.log(`- Total Design/Arts updated: ${countDes}`);
  console.log(`- Total Science/Research updated: ${countSci}`);
  console.log(`- Total Other updated: ${countOth}`);
  console.log(`- Total colleges processed: ${totalUpdated}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("Error in update-images script:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
