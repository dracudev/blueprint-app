const db = require("../../database");
const { models } = require("../../database/config/prisma");

const ServiceService = {
  getAll: async () => {
    return models.Service.findMany();
  },
  getByUser: async (user) => {
    return models.Service.findMany();
  },
  getById: async (id) => {
    return models.Service.findUnique({
      where: { serviceId: Number(id) },
    });
  },
  create: async (data) => {
    return models.Service.create({ data });
  },
  update: async (id, data) => {
    return models.Service.update({
      where: { serviceId: Number(id) },
      data,
    });
  },
  remove: async (id) => {
    return models.Service.delete({
      where: { serviceId: Number(id) },
    });
  },
};

module.exports = ServiceService;
