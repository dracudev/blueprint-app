const { PrismaClient } = require("@prisma/client");
const PrismaModelFactory = require("../factories/PrismaModelFactory");

// Simple singleton with connection string modification for serverless
global.__prisma = global.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  errorFormat: "pretty",
  datasources: {
    db: {
      url: process.env.VERCEL 
        ? process.env.DATABASE_URL + "?pgbouncer=true&connection_limit=1&prepared_statements=false"
        : process.env.DATABASE_URL
    }
  }
});

const prisma = global.__prisma;

const modelFactory = new PrismaModelFactory(prisma);

module.exports = {
  prisma,
  models: modelFactory.getModels(),
};
