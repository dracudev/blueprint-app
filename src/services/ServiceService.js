// Business logic for services
// Add methods as needed for CRUD
module.exports = {
  getAll: async () => {
    return await require("../models").Service.findMany();
  },
  getByUser: async (user) => {
    // Clients can view all services; admins can manage
    return await require("../models").Service.findMany();
  },
  create: async (data) => {
    return await require("../models").Service.create({ data });
  },
  update: async (id, data) => {
    return await require("../models").Service.update({
      where: { id: Number(id) },
      data,
    });
  },
  remove: async (id) => {
    return await require("../models").Service.delete({
      where: { id: Number(id) },
    });
  },
};
