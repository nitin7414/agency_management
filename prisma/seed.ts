import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create default config/admin row for settings (if none exists)
  const existingAdmin = await prisma.admin.findFirst();
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        darkMode: false,
      },
    });
    console.log("✅ App Config (Admin row) initialized");
  }

  // Create initial agency stock record
  const stock = await prisma.agencyStock.findFirst();
  if (!stock) {
    await prisma.agencyStock.create({ data: { totalFilled: 0, totalEmpty: 0 } });
    console.log("✅ Agency stock initialized");
  }

  console.log("🌱 Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());