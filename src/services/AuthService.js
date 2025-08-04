const { models } = require("../../database/config/prisma");
const bcrypt = require("bcrypt");

module.exports = {
  findUserByEmail: async (email) => {
    return models.User.findFirst({ where: { email } });
  },
  createUser: async ({ name, email, password, role = "registered" }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return models.User.create({
      data: { name, email, password: hashedPassword, role },
    });
  },
  validatePassword: async (password, hash) => {
    return bcrypt.compare(password, hash);
  },
};