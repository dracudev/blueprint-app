class DatabaseAdapter {
  constructor() {
    this.orm = null;
    this.models = {};
  }

  async connect() {
    try {
      const prismaConfig = require("./config/prisma");
      this.orm = prismaConfig.prisma;
      this.models = prismaConfig.models;

      await this.orm.$connect();
      console.log("✅ Prisma database connected successfully.");

      return this.orm;
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.orm && this.orm.$disconnect) {
        console.log("🛑 Closing Prisma database connection...");
        await this.orm.$disconnect();
      }
    } catch (error) {
      console.error("❌ Error disconnecting from database:", error);
    }
  }

  getModels() {
    if (!this.models || Object.keys(this.models).length === 0) {
      // If models aren't loaded yet, try to load them synchronously
      try {
        const prismaConfig = require("./config/prisma");
        this.models = prismaConfig.models;
      } catch (error) {
        console.error("Error loading models synchronously:", error);
        return {};
      }
    }

    return this.models || {};
  }

  async runMigrations() {
    console.log("📊 Use: npx prisma migrate dev");
    console.log("📊 Use: npx prisma db push (for prototype/development)");
  }

  async seedDatabase() {
    console.log("📊 Use: npx prisma db seed");
  }

  async generatePrismaClient() {
    console.log("📊 Use: npx prisma generate");
  }
}

module.exports = new DatabaseAdapter();
