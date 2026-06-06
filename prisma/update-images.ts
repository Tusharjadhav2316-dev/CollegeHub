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

const IMAGES = {
  iitBombay: "https://images.unsplash.com/photo-1562774053-701939374585",
  iitDelhi: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
  iim: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
  aiims: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
  nit: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6",
  private: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b",
  lawArts: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a",
  engineeringGen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  mbaGen: "https://images.unsplash.com/photo-1580582932707-520aed937b7b",
  design: "https://images.unsplash.com/photo-1497366216548-37526070297c"
};

function getCollegeImages(name: string, description: string, type: string) {
  const n = name.toLowerCase();
  const d = description.toLowerCase();
  const t = type.toLowerCase();

  let baseImage = IMAGES.engineeringGen;

  if (n.includes("bombay") && (n.includes("iit") || n.includes("technology"))) {
    baseImage = IMAGES.iitBombay;
  } else if (n.includes("delhi") && (n.includes("iit") || n.includes("technology"))) {
    baseImage = IMAGES.iitDelhi;
  } else if (n.includes("iim") || n.includes("management") || n.includes("business school") || n.includes("xlri") || n.includes("fms")) {
    baseImage = IMAGES.iim;
  } else if (n.includes("aiims") || n.includes("medical") || n.includes("dental") || n.includes("hospital") || d.includes("medical") || d.includes("mbbs")) {
    baseImage = IMAGES.aiims;
  } else if (n.includes("nit") || n.includes("national institute of technology") || n.includes("trichy") || n.includes("surathkal") || n.includes("warangal")) {
    baseImage = IMAGES.nit;
  } else if (n.includes("vit") || n.includes("srm") || n.includes("manipal") || n.includes("bits") || n.includes("birla") || n.includes("amity") || n.includes("lovely") || t.includes("private")) {
    baseImage = IMAGES.private;
  } else if (n.includes("law") || n.includes("arts") || n.includes("humanities") || n.includes("nlu") || n.includes("national law") || d.includes("law") || d.includes("arts")) {
    baseImage = IMAGES.lawArts;
  } else if (n.includes("design") || n.includes("nid") || n.includes("nift") || n.includes("fashion") || d.includes("design") || d.includes("fashion")) {
    baseImage = IMAGES.design;
  } else if (d.includes("engineering") || d.includes("technology") || d.includes("b.tech") || d.includes("m.tech")) {
    baseImage = IMAGES.engineeringGen;
  } else if (d.includes("mba") || d.includes("management") || d.includes("bba")) {
    baseImage = IMAGES.mbaGen;
  }

  return {
    thumbnail: `${baseImage}?w=800&q=80`,
    banner: `${baseImage}?w=1200&q=80`
  };
}

async function main() {
  console.log("Fetching colleges...");
  const colleges = await prisma.college.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      type: true
    }
  });

  console.log(`Classifying and updating ${colleges.length} colleges...`);
  
  let count = 0;
  for (const college of colleges) {
    const { thumbnail, banner } = getCollegeImages(college.name, college.description, college.type);
    
    await prisma.college.update({
      where: { id: college.id },
      data: {
        thumbnail,
        banner
      }
    });

    count++;
    if (count % 100 === 0) {
      console.log(`Updated ${count} colleges...`);
    }
  }

  console.log(`Success! Updated ${count} colleges with Unsplash image assets.`);
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
