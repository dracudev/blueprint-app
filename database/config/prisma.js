const { PrismaClient } = require("@prisma/client");
const PrismaModelFactory = require("../factories/PrismaModelFactory");

global.prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    errorFormat: "pretty",
  });

const prisma = global.prisma;

const modelFactory = new PrismaModelFactory(prisma);

module.exports = {
  prisma,
  models: modelFactory.getModels(),
};
