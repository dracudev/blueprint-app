const ProjectService = {
  getAll: async () => {
    return await require("../models").Project.findMany();
  },
  getByUser: async (user) => {
    // Find projects by client email (get clientId first)
    const client = await require("../models").Client.findFirst({
      where: { email: user.email },
    });
    if (!client) return [];
    return await require("../models").Project.findMany({
      where: { clientId: client.clientId },
    });
  },
  create: async (data) => {
    return await require("../models").Project.create({ data });
  },
  update: async (id, data) => {
    return await require("../models").Project.update({
      where: { id: Number(id) },
      data,
    });
  },
  remove: async (id) => {
    return await require("../models").Project.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = ProjectService;
