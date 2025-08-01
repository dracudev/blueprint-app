const { PrismaClient, Role } = require("./generated/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

async function main() {
  console.log("🌱 Seeding database...");
  const adminPassword = await bcrypt.hash("admin", 10);
  const userPassword = await bcrypt.hash("user", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@admin.com",
      password: adminPassword,
      role: Role.admin,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: "user@user.com" },
    update: {},
    create: {
      name: "User",
      email: "user@user.com",
      password: userPassword,
      role: Role.registered,
    },
  });

  console.log("👤 Created users:", { adminUser, regularUser });

  const webDevelopment = await prisma.service.upsert({
    where: { serviceId: 1 },
    update: {
      serviceName: "Website Development",
      description:
        "Complete website development including design, frontend, and backend implementation. Includes responsive design, SEO optimization, and content management system.",
      price: 2500.0,
    },
    create: {
      serviceName: "Website Development",
      description:
        "Complete website development including design, frontend, and backend implementation. Includes responsive design, SEO optimization, and content management system.",
      price: 2500.0,
    },
  });

  const mobileApp = await prisma.service.upsert({
    where: { serviceId: 2 },
    update: {
      serviceName: "Mobile App Development",
      description:
        "Native and cross-platform mobile application development for iOS and Android. Includes UI/UX design, backend integration, and app store deployment.",
      price: 4000.0,
    },
    create: {
      serviceName: "Mobile App Development",
      description:
        "Native and cross-platform mobile application development for iOS and Android. Includes UI/UX design, backend integration, and app store deployment.",
      price: 4000.0,
    },
  });

  const ecommerce = await prisma.service.upsert({
    where: { serviceId: 3 },
    update: {
      serviceName: "E-commerce Platform",
      description:
        "Full-featured e-commerce platform with payment integration, inventory management, project tracking, and admin dashboard. Includes shopping cart and checkout functionality.",
      price: 6000.0,
    },
    create: {
      serviceName: "E-commerce Platform",
      description:
        "Full-featured e-commerce platform with payment integration, inventory management, project tracking, and admin dashboard. Includes shopping cart and checkout functionality.",
      price: 6000.0,
    },
  });

  console.log("📦 Created services:", { webDevelopment, mobileApp, ecommerce });

  const client1 = await prisma.client.upsert({
    where: { email: "contact@techsolutions.com" },
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
    where: { email: "john.doe@email.com" },
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

  const project1 = await prisma.project.upsert({
    where: { projectId: 1 },
    update: {},
    create: {
      clientId: client1.clientId,
      jobStatus: "IN_PROGRESS",
      totalAmount: 5000.0,
    },
  });

  const project2 = await prisma.project.upsert({
    where: { projectId: 2 },
    update: {},
    create: {
      clientId: client2.clientId,
      jobStatus: "RECEIVED",
      totalAmount: 3000.0,
    },
  });

  console.log("📋 Created projects:", { project1, project2 });

  const projectItem1 = await prisma.projectItem.upsert({
    where: { projectItemId: 1 },
    update: {},
    create: {
      projectId: project1.projectId,
      serviceId: webDevelopment.serviceId,
      quantity: 1,
      unitPrice: 5000.0,
    },
  });

  const projectItem2 = await prisma.projectItem.upsert({
    where: { projectItemId: 2 },
    update: {},
    create: {
      projectId: project2.projectId,
      serviceId: mobileApp.serviceId,
      quantity: 1,
      unitPrice: 3000.0,
    },
  });

  console.log("📝 Created project items:", { projectItem1, projectItem2 });

  const payment1 = await prisma.payment.upsert({
    where: { paymentId: 1 },
    update: {},
    create: {
      projectId: project1.projectId,
      paymentStatus: "PARTIALLY_PAID",
      paidAmount: 2500.0,
    },
  });

  const payment2 = await prisma.payment.upsert({
    where: { paymentId: 2 },
    update: {},
    create: {
      projectId: project2.projectId,
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
