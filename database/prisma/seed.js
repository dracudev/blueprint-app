const { PrismaClient, Role } = require("./generated/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

async function main() {
  console.log("🌱 Seeding database...");
  // Create sample users
  const adminPassword = await bcrypt.hash("admin", 10);
  const userPassword = await bcrypt.hash("user", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@admin.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: "user@user.com" },
    update: {},
    create: {
      name: "User",
      email: "user@user.com",
      password: userPassword,
      role: Role.USER,
    },
  });

  console.log("👤 Created users:", { adminUser, regularUser });

  // Create sample products
  const webDevelopment = await prisma.product.upsert({
    where: { productId: 1 },
    update: {},
    create: {
      productName: "Website Development",
    },
  });

  const mobileApp = await prisma.product.upsert({
    where: { productId: 2 },
    update: {},
    create: {
      productName: "Mobile App Development",
    },
  });

  const ecommerce = await prisma.product.upsert({
    where: { productId: 3 },
    update: {},
    create: {
      productName: "E-commerce Platform",
    },
  });

  console.log("📦 Created products:", { webDevelopment, mobileApp, ecommerce });

  // Create sample clients
  const client1 = await prisma.client.upsert({
    where: { clientId: 1 },
    update: {},
    create: {
      isCompany: true,
      companyName: "Tech Solutions Inc.",
      email: "contact@techsolutions.com",
      phone: "+1-555-0123",
      billingAddress: "123 Tech Street, Silicon Valley, CA 94000",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { clientId: 2 },
    update: {},
    create: {
      isCompany: false,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1-555-0456",
      billingAddress: "456 Main Street, Anytown, USA 12345",
    },
  });

  console.log("👥 Created clients:", { client1, client2 });

  // Create sample orders
  const order1 = await prisma.order.upsert({
    where: { orderId: 1 },
    update: {},
    create: {
      clientId: client1.clientId,
      jobStatus: "IN_PROGRESS",
      totalAmount: 5000.0,
    },
  });

  const order2 = await prisma.order.upsert({
    where: { orderId: 2 },
    update: {},
    create: {
      clientId: client2.clientId,
      jobStatus: "RECEIVED",
      totalAmount: 3000.0,
    },
  });

  console.log("📋 Created orders:", { order1, order2 });

  // Create order items
  const orderItem1 = await prisma.orderItem.upsert({
    where: { orderItemId: 1 },
    update: {},
    create: {
      orderId: order1.orderId,
      productId: webDevelopment.productId,
      quantity: 1,
      unitPrice: 5000.0,
    },
  });

  const orderItem2 = await prisma.orderItem.upsert({
    where: { orderItemId: 2 },
    update: {},
    create: {
      orderId: order2.orderId,
      productId: mobileApp.productId,
      quantity: 1,
      unitPrice: 3000.0,
    },
  });

  console.log("📝 Created order items:", { orderItem1, orderItem2 });

  // Create payments
  const payment1 = await prisma.payment.upsert({
    where: { paymentId: 1 },
    update: {},
    create: {
      orderId: order1.orderId,
      paymentStatus: "PARTIALLY_PAID",
      paidAmount: 2500.0,
    },
  });

  const payment2 = await prisma.payment.upsert({
    where: { paymentId: 2 },
    update: {},
    create: {
      orderId: order2.orderId,
      paymentStatus: "UNPAID",
      paidAmount: 0.0,
    },
  });

  console.log("💰 Created payments:", { payment1, payment2 });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
