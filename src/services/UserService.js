const { models } = require("../../database/config/prisma");
module.exports = {
  async getAll() {
    return models.User.findMany();
  },
  async findById(id) {
    return models.User.findFirst({ where: { id: Number(id) } });
  },
  async findByEmail(email) {
    return models.User.findFirst({ where: { email } });
  },
  async create(data) {
    return models.User.create({ data });
  },
  async update(id, data) {
    return models.User.update({ where: { id: Number(id) }, data });
  },
  async remove(id) {
    return models.User.delete({ where: { id: Number(id) } });
  },
  async updateRoleByEmail(email, role) {
    return models.User.update({
      where: { email },
      data: { role },
    });
  },
};
