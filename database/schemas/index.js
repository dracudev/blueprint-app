const clientSchema = require("./clientSchema");
const orderSchema = require("./orderSchema");
const productSchema = require("./productSchema");
const orderItemSchema = require("./orderItemSchema");
const paymentSchema = require("./paymentSchema");

module.exports = {
  Client: clientSchema,
  Order: orderSchema,
  Product: productSchema,
  OrderItem: orderItemSchema,
  Payment: paymentSchema,

  // Helper function to get all schemas
  getAll() {
    return {
      Client: clientSchema,
      Order: orderSchema,
      Product: productSchema,
      OrderItem: orderItemSchema,
      Payment: paymentSchema,
    };
  },

  // Helper function to get schema by name
  getSchema(name) {
    return this[name];
  },
};
