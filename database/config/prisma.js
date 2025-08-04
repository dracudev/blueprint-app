const { PrismaClient } = require("@prisma/client");
const PrismaModelFactory = require("../factories/PrismaModelFactory");
const { initializePrismaForServerless } = require("../utils/serverless");

const prisma = initializePrismaForServerless(PrismaClient, {
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  errorFormat: "pretty",
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  ...(process.env.NODE_ENV === "production" && {
    datasourceUrl: process.env.DATABASE_URL,
  }),
});

const modelFactory = new PrismaModelFactory(prisma);

module.exports = {
  prisma,
  models: modelFactory.getModels(),
};
