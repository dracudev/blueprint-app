// Prisma Configuration
const { PrismaClient } = require("../prisma/generated/client");
const PrismaModelFactory = require("../factories/PrismaModelFactory");

// Create Prisma client instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
});

// Create model factory with Prisma client
const modelFactory = new PrismaModelFactory(prisma);

// Export Prisma client and models
module.exports = {
  prisma,
  models: modelFactory.getModels(),
};
