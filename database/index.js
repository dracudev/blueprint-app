class DatabaseAdapter {
  constructor() {
    this.orm = null;
  }

  async connect() {
    try {
      const prismaConfig = require("./config/prisma");
      this.orm = prismaConfig.prisma;

      // In serverless environments, we don't need explicit connection
      // Prisma handles connections automatically
      if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        await this.orm.$connect();
        console.log("✅ Database connected successfully.");
      } else {
        console.log("✅ Database configured for serverless environment.");
      }

      return this.orm;
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      // In serverless environments, we don't manually disconnect
      // Let Prisma handle connection lifecycle
      if (this.orm && this.orm.$disconnect && (process.env.NODE_ENV !== 'production' || !process.env.VERCEL)) {
        console.log("🛑 Closing database connection...");
        await this.orm.$disconnect();
      }
    } catch (error) {
      console.error("❌ Error disconnecting from database:", error);
    }
  }

  getORM() {
    if (!this.orm) {
      // If ORM isn't loaded yet, try to load it synchronously
      try {
        const prismaConfig = require("./config/prisma");
        this.orm = prismaConfig.prisma;
      } catch (error) {
        console.error("Error loading ORM synchronously:", error);
        return null;
      }
    }

    return this.orm;
  }

  getModels() {
    try {
      const prismaConfig = require("./config/prisma");
      return prismaConfig.models;
    } catch (error) {
      console.error("Error loading models:", error);
      return {};
    }
  }

  async runMigrations() {
    console.log("📊 Use: npx prisma migrate dev");
    console.log("📊 Use: npx prisma db push (for prototype/development)");
  }

  async seedDatabase() {
    console.log("📊 Use: npx prisma db seed");
  }

  async generateClient() {
    console.log("📊 Use: npx prisma generate");
  }
}

module.exports = new DatabaseAdapter();
