const ServiceService = {
  getAll: async () => {
    return await require("../models").Service.findMany();
  },
  getByUser: async (user) => {
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

module.exports = ServiceService;
