import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.category.createMany({
    data: [
      {
        name: "Business",
        slug: "business",
        description: "Course seputar bisnis dan entrepreneurship",
      },
      {
        name: "Digital Skill",
        slug: "digital-skill",
        description: "Course keterampilan digital",
      },
      {
        name: "Productivity",
        slug: "productivity",
        description: "Course produktivitas dan pengembangan diri",
      },
    ],
    skipDuplicates: true,
  });

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const salt = randomBytes(16).toString("hex");
  const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      fullName: process.env.ADMIN_FULL_NAME ?? "Administrator Sinau",
      passwordHash,
      role: "admin",
      status: "active",
    },
    update: {
      fullName: process.env.ADMIN_FULL_NAME ?? "Administrator Sinau",
      role: "admin",
      status: "active",
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .then(() => process.exit(0))
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
