class PrismaModelFactory {
  constructor(prismaClient) {
    this.prisma = prismaClient;
    this.models = {};
    this.initializeModels();
  }

  initializeModels() {
    this.models = {
      User: this.createUserModel(),
      Client: this.createClientModel(),
      Order: this.createOrderModel(),
      Product: this.createProductModel(),
      OrderItem: this.createOrderItemModel(),
      Payment: this.createPaymentModel(),
    };
  }

  createUserModel() {
    return {
      findMany: (options = {}) => this.prisma.user.findMany(options),
      findUnique: (options) => this.prisma.user.findUnique(options),
      findFirst: (options) => this.prisma.user.findFirst(options),
      create: (options) => this.prisma.user.create(options),
      update: (options) => this.prisma.user.update(options),
      delete: (options) => this.prisma.user.delete(options),
      count: (options = {}) => this.prisma.user.count(options),
      upsert: (options) => this.prisma.user.upsert(options),
      deleteMany: (options = {}) => this.prisma.user.deleteMany(options),
      updateMany: (options) => this.prisma.user.updateMany(options),
    };
  }

  createClientModel() {
    return {
      findMany: (options = {}) => this.prisma.client.findMany(options),
      findUnique: (options) => this.prisma.client.findUnique(options),
      findFirst: (options) => this.prisma.client.findFirst(options),
      create: (options) => this.prisma.client.create(options),
      update: (options) => this.prisma.client.update(options),
      delete: (options) => this.prisma.client.delete(options),
      count: (options = {}) => this.prisma.client.count(options),
      upsert: (options) => this.prisma.client.upsert(options),
      deleteMany: (options = {}) => this.prisma.client.deleteMany(options),
      updateMany: (options) => this.prisma.client.updateMany(options),
    };
  }

  createOrderModel() {
    return {
      findMany: (options = {}) => this.prisma.order.findMany(options),
      findUnique: (options) => this.prisma.order.findUnique(options),
      findFirst: (options) => this.prisma.order.findFirst(options),
      create: (options) => this.prisma.order.create(options),
      update: (options) => this.prisma.order.update(options),
      delete: (options) => this.prisma.order.delete(options),
      count: (options = {}) => this.prisma.order.count(options),
      upsert: (options) => this.prisma.order.upsert(options),
      deleteMany: (options = {}) => this.prisma.order.deleteMany(options),
      updateMany: (options) => this.prisma.order.updateMany(options),
    };
  }

  createProductModel() {
    return {
      findMany: (options = {}) => this.prisma.product.findMany(options),
      findUnique: (options) => this.prisma.product.findUnique(options),
      findFirst: (options) => this.prisma.product.findFirst(options),
      create: (options) => this.prisma.product.create(options),
      update: (options) => this.prisma.product.update(options),
      delete: (options) => this.prisma.product.delete(options),
      count: (options = {}) => this.prisma.product.count(options),
      upsert: (options) => this.prisma.product.upsert(options),
      deleteMany: (options = {}) => this.prisma.product.deleteMany(options),
      updateMany: (options) => this.prisma.product.updateMany(options),
    };
  }

  createOrderItemModel() {
    return {
      findMany: (options = {}) => this.prisma.orderItem.findMany(options),
      findUnique: (options) => this.prisma.orderItem.findUnique(options),
      findFirst: (options) => this.prisma.orderItem.findFirst(options),
      create: (options) => this.prisma.orderItem.create(options),
      update: (options) => this.prisma.orderItem.update(options),
      delete: (options) => this.prisma.orderItem.delete(options),
      count: (options = {}) => this.prisma.orderItem.count(options),
      upsert: (options) => this.prisma.orderItem.upsert(options),
      deleteMany: (options = {}) => this.prisma.orderItem.deleteMany(options),
      updateMany: (options) => this.prisma.orderItem.updateMany(options),
    };
  }

  createPaymentModel() {
    return {
      findMany: (options = {}) => this.prisma.payment.findMany(options),
      findUnique: (options) => this.prisma.payment.findUnique(options),
      findFirst: (options) => this.prisma.payment.findFirst(options),
      create: (options) => this.prisma.payment.create(options),
      update: (options) => this.prisma.payment.update(options),
      delete: (options) => this.prisma.payment.delete(options),
      count: (options = {}) => this.prisma.payment.count(options),
      upsert: (options) => this.prisma.payment.upsert(options),
      deleteMany: (options = {}) => this.prisma.payment.deleteMany(options),
      updateMany: (options) => this.prisma.payment.updateMany(options),
    };
  }

  getModels() {
    return this.models;
  }

  getModel(name) {
    return this.models[name];
  }
}

module.exports = PrismaModelFactory;
