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

  // Helper function to get all schemas

  getAll() {
    return {
      Client: clientSchema,
      Project: projectSchema,
      Service: serviceSchema,
      ProjectItem: projectItemSchema,
      Payment: paymentSchema,
    };
  },

  // Helper function to get schema by name
  getSchema(name) {
    return this[name];
  },
};
