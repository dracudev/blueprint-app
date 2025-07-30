const models = require("../models");

module.exports = {
  async getAll() {
    return models.Client.findMany();
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
    return models.Client.update({ where: { id: Number(id) }, data });
  },
  async updateByEmail(email, data) {
    return models.Client.update({ where: { email }, data });
  },
  async remove(id) {
    return models.Client.delete({ where: { id: Number(id) } });
  },
  async findWithOrdersByEmail(email) {
    return models.Client.findFirst({
      where: { email },
      include: {
        orders: {
          include: {
            orderItems: {
              include: { product: true },
            },
            payments: true,
          },
        },
      },
    });
  },
};
