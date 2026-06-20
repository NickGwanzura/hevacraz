const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create default admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@hevacraz.org";
  const adminPassword = "admin123"; // Change on first login

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: "HEVACRAZ Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin user already exists");
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
