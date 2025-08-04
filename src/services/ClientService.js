const { models } = require("../../database/config/prisma");
const { safeQueryExecution } = require("../../database/utils/serverless");

module.exports = {
  async getAll() {
    return safeQueryExecution(() => models.Client.findMany());
  },
  async getById(clientId) {
    return safeQueryExecution(() => 
      models.Client.findFirst({ where: { clientId: Number(clientId) } })
    );
  },
  async getByUser(user) {
    return safeQueryExecution(() =>
      models.Client.findMany({ where: { email: user.email } })
    );
  },
  async findByEmail(email) {
    return safeQueryExecution(() =>
      models.Client.findFirst({ where: { email } })
    );
  },
  async create(data) {
    return safeQueryExecution(() => models.Client.create({ data }));
  },
  async update(id, data) {
    return safeQueryExecution(() =>
      models.Client.update({ where: { clientId: Number(id) }, data })
    );
  },
  async updateByEmail(email, data) {
    return safeQueryExecution(() =>
      models.Client.update({ where: { email }, data })
    );
  },
  async remove(id) {
    return safeQueryExecution(() =>
      models.Client.delete({ where: { clientId: Number(id) } })
    );
  },
  async findWithProjectsByEmail(email) {
    return safeQueryExecution(() =>
      models.Client.findFirst({
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
      })
    );
  },
  async getByIdWithProjects(clientId) {
    return safeQueryExecution(() =>
      models.Client.findFirst({
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
      })
    );
  },
};
