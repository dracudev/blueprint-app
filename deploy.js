#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");

console.log("🚀 Starting deployment process...");

function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n📋 ${description}`);
    console.log(`Running: ${command}`);

    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.log(`⚠️  Warning: ${stderr}`);
      }

      if (stdout) {
        console.log(stdout);
      }

      console.log(`✅ ${description} completed successfully`);
      resolve();
    });
  });
}

async function deploy() {
  try {
    await runCommand(
      "npx prisma generate --schema=database/prisma/schema.prisma",
      "Generating Prisma Client"
    );

    await runCommand(
      "npx prisma migrate deploy --schema=database/prisma/schema.prisma",
      "Running database migrations"
    );

    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Deployment failed:", error.message);
    process.exit(1);
  }
}

deploy();
