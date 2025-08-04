const { PrismaClient } = require("@prisma/client");
const PrismaModelFactory = require("../factories/PrismaModelFactory");
const { initializePrismaForServerless } = require("../utils/serverless");

// Use serverless-optimized Prisma client initialization
const prisma = initializePrismaForServerless(PrismaClient, {
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
  // Connection pool settings for serverless
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const modelFactory = new PrismaModelFactory(prisma);

module.exports = {
  prisma,
  models: modelFactory.getModels(),
};
