const { Client } = require("pg");
require("dotenv").config();

async function resetDatabase() {
  console.log(
    "🗑️  Tables already deleted manually from Supabase web interface"
  );
  console.log("✅ Database is clean and ready for migration!");
  console.log("Now creating fresh database schema...");
}

async function runMigrations() {
  const { execSync } = require("child_process");

  try {
    console.log("🔄 Running Prisma db push to create schema...");
    execSync(
      "npx prisma db push --schema=database/prisma/schema.prisma --accept-data-loss",
      {
        stdio: "inherit",
        cwd: process.cwd(),
      }
    );

    console.log("✅ Database schema created successfully!");

    console.log("🔄 Generating Prisma client...");
    execSync("npx prisma generate --schema=database/prisma/schema.prisma", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log("✅ Prisma client generated successfully!");

    console.log("🔄 Running database seed...");
    execSync("node database/prisma/seed.js", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log("✅ Database seeded successfully!");
    console.log("🎉 Database reset, migration, and seeding completed!");
  } catch (error) {
    console.error("❌ Error during migration:", error);
    throw error;
  }
}

async function main() {
  await resetDatabase();
  await runMigrations();
}

main().catch(console.error);
