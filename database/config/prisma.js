const { PrismaClient } = require("@prisma/client");
const PrismaModelFactory = require("../factories/PrismaModelFactory");

// For serverless environments, create a new instance each time to avoid prepared statement conflicts
// For development, use global caching
let prisma;

if (process.env.VERCEL) {
  // In serverless, create a new instance to avoid prepared statement conflicts
  prisma = new PrismaClient({
    log: ["error"],
    errorFormat: "pretty",
  });
} else {
  // In development, use global caching
  global.prisma =
    global.prisma ||
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      errorFormat: "pretty",
    });
  prisma = global.prisma;
}

const modelFactory = new PrismaModelFactory(prisma);

module.exports = {
  prisma,
  models: modelFactory.getModels(),
};
