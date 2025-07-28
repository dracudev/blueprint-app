const { PrismaClient } = require("../prisma/generated/client");
const PrismaModelFactory = require("../factories/PrismaModelFactory");

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

const modelFactory = new PrismaModelFactory(prisma);

module.exports = {
  prisma,
  models: modelFactory.getModels(),
};
