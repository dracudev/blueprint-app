const models = require("../models");

const UserService = {
  async updateRoleByEmail(email, role) {
    return await models.User.update({
      where: { email },
      data: { role },
    });
  },
  // Add more user-related service methods as needed
};

module.exports = UserService;
