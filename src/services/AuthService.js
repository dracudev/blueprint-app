// Business logic for authentication and user management
const models = require("../models");
const bcrypt = require("bcrypt");

module.exports = {
  findUserByEmail: async (email) => {
    return await models.User.findFirst({ where: { email } });
  },
  createUser: async ({ name, email, password, role = "registered" }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await models.User.create({
      data: { name, email, password: hashedPassword, role },
    });
  },
  validatePassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },
  // Add more auth-related business logic as needed
};
