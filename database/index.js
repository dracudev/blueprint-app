// Database Abstraction Layer - Prisma Only

class DatabaseAdapter {
  constructor() {
    this.orm = null;
    this.models = {};
  }

  async connect() {
    try {
      // Load Prisma configuration
      const prismaConfig = require("./config/prisma");
      this.orm = prismaConfig.prisma;
      this.models = prismaConfig.models;
      
      // Test the connection
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
    return this.models || {
      Client: this.models?.Client,
      Order: this.models?.Order,
      Product: this.models?.Product,
      OrderItem: this.models?.OrderItem,
      Payment: this.models?.Payment,
    };
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
