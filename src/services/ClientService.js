const { models } = require("../../database/config/prisma");

module.exports = {
  async getAll() {
    return models.Client.findMany();
  },
  async getById(clientId) {
    return models.Client.findFirst({ where: { clientId: Number(clientId) } });
  },
  async getByUser(user) {
    return models.Client.findMany({ where: { email: user.email } });
  },
  async findByEmail(email) {
    return models.Client.findFirst({ where: { email } });
  },
  async create(data) {
    return models.Client.create({ data });
  },
  async update(id, data) {
    return models.Client.update({ where: { clientId: Number(id) }, data });
  },
  async updateByEmail(email, data) {
    return models.Client.update({ where: { email }, data });
  },
  async remove(id) {
    return models.Client.delete({ where: { clientId: Number(id) } });
  },
  async findWithProjectsByEmail(email) {
    return models.Client.findFirst({
      where: { email },
      include: {
        projects: {
          include: {
            projectItems: {
              include: { service: true },
            },
            payments: true,
          },
        },
      },
    });
  },
  async getByIdWithProjects(clientId) {
    return models.Client.findFirst({
      where: { clientId: Number(clientId) },
      include: {
        projects: {
          include: {
            projectItems: {
              include: { service: true },
            },
            payments: true,
          },
        },
      },
    });
  },
};