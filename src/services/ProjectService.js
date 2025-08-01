const { models } = require("../../database/config/prisma");

const ProjectService = {
  getAll: async () => {
    return models.Project.findMany();
  },
  getById: async (id) => {
    return models.Project.findUnique({
      where: { id: Number(id) },
    });
  },
  getByUser: async (user) => {
    const client = await models.Client.findFirst({
      where: { email: user.email },
    });
    if (!client) return [];
    return models.Project.findMany({ where: { clientId: client.clientId } });
  },
  create: async (data) => {
    return models.Project.create({ data });
  },
  update: async (id, data) => {
    return models.Project.update({ where: { id: Number(id) }, data });
  },
  remove: async (id) => {
    return models.Project.delete({ where: { id: Number(id) } });
  },
};

module.exports = ProjectService;
