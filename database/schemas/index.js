const clientSchema = require("./clientSchema");
const projectSchema = require("./projectSchema");
const serviceSchema = require("./serviceSchema");
const projectItemSchema = require("./projectItemSchema");
const paymentSchema = require("./paymentSchema");

module.exports = {
  Client: clientSchema,
  Project: projectSchema,
  Service: serviceSchema,
  ProjectItem: projectItemSchema,
  Payment: paymentSchema,

  getAll() {
    return {
      Client: clientSchema,
      Project: projectSchema,
      Service: serviceSchema,
      ProjectItem: projectItemSchema,
      Payment: paymentSchema,
    };
  },

  getSchema(name) {
    return this[name];
  },
};
