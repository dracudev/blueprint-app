// Prisma Model Factory - Converts abstract schemas to Prisma models

class PrismaModelFactory {
  constructor(prismaClient) {
    this.prisma = prismaClient;
    this.models = {};
    this.initializeModels();
  }

  initializeModels() {
    // Map Prisma models to our abstracted interface
    this.models = {
      Client: this.createClientModel(),
      Order: this.createOrderModel(),
      Product: this.createProductModel(),
      OrderItem: this.createOrderItemModel(),
      Payment: this.createPaymentModel(),
    };
  }

  createClientModel() {
    return {
      // Standard CRUD operations
      findAll: (options = {}) => this.prisma.client.findMany(options),
      findByPk: (id, options = {}) => this.prisma.client.findUnique({ 
        where: { clientId: id }, 
        ...options 
      }),
      findOne: (options = {}) => this.prisma.client.findFirst(options),
      create: (data) => this.prisma.client.create({ data }),
      update: (data, options) => this.prisma.client.update({
        where: options.where || { clientId: data.clientId },
        data
      }),
      destroy: (options) => this.prisma.client.delete(options),
      
      // Prisma-specific methods
      findMany: (options = {}) => this.prisma.client.findMany(options),
      findUnique: (options) => this.prisma.client.findUnique(options),
      findFirst: (options) => this.prisma.client.findFirst(options),
      count: (options = {}) => this.prisma.client.count(options),
      upsert: (options) => this.prisma.client.upsert(options),
      deleteMany: (options = {}) => this.prisma.client.deleteMany(options),
      updateMany: (options) => this.prisma.client.updateMany(options),
    };
  }

  createOrderModel() {
    return {
      // Standard CRUD operations
      findAll: (options = {}) => this.prisma.order.findMany(options),
      findByPk: (id, options = {}) => this.prisma.order.findUnique({ 
        where: { orderId: id }, 
        ...options 
      }),
      findOne: (options = {}) => this.prisma.order.findFirst(options),
      create: (data) => this.prisma.order.create({ data }),
      update: (data, options) => this.prisma.order.update({
        where: options.where || { orderId: data.orderId },
        data
      }),
      destroy: (options) => this.prisma.order.delete(options),
      
      // Prisma-specific methods
      findMany: (options = {}) => this.prisma.order.findMany(options),
      findUnique: (options) => this.prisma.order.findUnique(options),
      findFirst: (options) => this.prisma.order.findFirst(options),
      count: (options = {}) => this.prisma.order.count(options),
      upsert: (options) => this.prisma.order.upsert(options),
      deleteMany: (options = {}) => this.prisma.order.deleteMany(options),
      updateMany: (options) => this.prisma.order.updateMany(options),
    };
  }

  createProductModel() {
    return {
      // Standard CRUD operations
      findAll: (options = {}) => this.prisma.product.findMany(options),
      findByPk: (id, options = {}) => this.prisma.product.findUnique({ 
        where: { productId: id }, 
        ...options 
      }),
      findOne: (options = {}) => this.prisma.product.findFirst(options),
      create: (data) => this.prisma.product.create({ data }),
      update: (data, options) => this.prisma.product.update({
        where: options.where || { productId: data.productId },
        data
      }),
      destroy: (options) => this.prisma.product.delete(options),
      
      // Prisma-specific methods
      findMany: (options = {}) => this.prisma.product.findMany(options),
      findUnique: (options) => this.prisma.product.findUnique(options),
      findFirst: (options) => this.prisma.product.findFirst(options),
      count: (options = {}) => this.prisma.product.count(options),
      upsert: (options) => this.prisma.product.upsert(options),
      deleteMany: (options = {}) => this.prisma.product.deleteMany(options),
      updateMany: (options) => this.prisma.product.updateMany(options),
    };
  }

  createOrderItemModel() {
    return {
      // Standard CRUD operations
      findAll: (options = {}) => this.prisma.orderItem.findMany(options),
      findByPk: (id, options = {}) => this.prisma.orderItem.findUnique({ 
        where: { orderItemId: id }, 
        ...options 
      }),
      findOne: (options = {}) => this.prisma.orderItem.findFirst(options),
      create: (data) => this.prisma.orderItem.create({ data }),
      update: (data, options) => this.prisma.orderItem.update({
        where: options.where || { orderItemId: data.orderItemId },
        data
      }),
      destroy: (options) => this.prisma.orderItem.delete(options),
      
      // Prisma-specific methods
      findMany: (options = {}) => this.prisma.orderItem.findMany(options),
      findUnique: (options) => this.prisma.orderItem.findUnique(options),
      findFirst: (options) => this.prisma.orderItem.findFirst(options),
      count: (options = {}) => this.prisma.orderItem.count(options),
      upsert: (options) => this.prisma.orderItem.upsert(options),
      deleteMany: (options = {}) => this.prisma.orderItem.deleteMany(options),
      updateMany: (options) => this.prisma.orderItem.updateMany(options),
    };
  }

  createPaymentModel() {
    return {
      // Standard CRUD operations
      findAll: (options = {}) => this.prisma.payment.findMany(options),
      findByPk: (id, options = {}) => this.prisma.payment.findUnique({ 
        where: { paymentId: id }, 
        ...options 
      }),
      findOne: (options = {}) => this.prisma.payment.findFirst(options),
      create: (data) => this.prisma.payment.create({ data }),
      update: (data, options) => this.prisma.payment.update({
        where: options.where || { paymentId: data.paymentId },
        data
      }),
      destroy: (options) => this.prisma.payment.delete(options),
      
      // Prisma-specific methods
      findMany: (options = {}) => this.prisma.payment.findMany(options),
      findUnique: (options) => this.prisma.payment.findUnique(options),
      findFirst: (options) => this.prisma.payment.findFirst(options),
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
