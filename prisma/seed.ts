import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default admin
  const existing = await prisma.admin.findFirst();
  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 12);
    await prisma.admin.create({
      data: {
        name: "Admin",
        email: "admin@ssga.com",
        password: hashed,
      },
    });
    console.log("✅ Admin created: admin@ssga.com / admin123");
    console.log("   ⚠️  Change the password after first login!");
  } else {
    console.log("ℹ️  Admin already exists, skipping.");
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