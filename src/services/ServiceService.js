const db = require("../../database");
const { models } = require("../../database/config/prisma");

const ServiceService = {
  getAll: async () => {
    return models.Service.findMany();
  },
  getByUser: async (user) => {
    return models.Service.findMany();
  },
  create: async (data) => {
    return models.Service.create({ data });
  },
  update: async (id, data) => {
    return models.Service.update({
      where: { id: Number(id) },
      data,
    });
  },
  remove: async (id) => {
    return models.Service.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = ServiceService;
