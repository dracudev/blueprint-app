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
      Project: this.createProjectModel(),
      Service: this.createServiceModel(),
      ProjectItem: this.createProjectItemModel(),
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

  createProjectModel() {
    return {
      findMany: (options = {}) => this.prisma.project.findMany(options),
      findUnique: (options) => this.prisma.project.findUnique(options),
      findFirst: (options) => this.prisma.project.findFirst(options),
      create: (options) => this.prisma.project.create(options),
      update: (options) => this.prisma.project.update(options),
      delete: (options) => this.prisma.project.delete(options),
      count: (options = {}) => this.prisma.project.count(options),
      upsert: (options) => this.prisma.project.upsert(options),
      deleteMany: (options = {}) => this.prisma.project.deleteMany(options),
      updateMany: (options) => this.prisma.project.updateMany(options),
    };
  }

  createServiceModel() {
    return {
      findMany: (options = {}) => this.prisma.service.findMany(options),
      findUnique: (options) => this.prisma.service.findUnique(options),
      findFirst: (options) => this.prisma.service.findFirst(options),
      create: (options) => this.prisma.service.create(options),
      update: (options) => this.prisma.service.update(options),
      delete: (options) => this.prisma.service.delete(options),
      count: (options = {}) => this.prisma.service.count(options),
      upsert: (options) => this.prisma.service.upsert(options),
      deleteMany: (options = {}) => this.prisma.service.deleteMany(options),
      updateMany: (options) => this.prisma.service.updateMany(options),
    };
  }

  createProjectItemModel() {
    return {
      findMany: (options = {}) => this.prisma.projectItem.findMany(options),
      findUnique: (options) => this.prisma.projectItem.findUnique(options),
      findFirst: (options) => this.prisma.projectItem.findFirst(options),
      create: (options) => this.prisma.projectItem.create(options),
      update: (options) => this.prisma.projectItem.update(options),
      delete: (options) => this.prisma.projectItem.delete(options),
      count: (options = {}) => this.prisma.projectItem.count(options),
      upsert: (options) => this.prisma.projectItem.upsert(options),
      deleteMany: (options = {}) => this.prisma.projectItem.deleteMany(options),
      updateMany: (options) => this.prisma.projectItem.updateMany(options),
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
