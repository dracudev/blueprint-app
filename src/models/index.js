const database = require("../../database");

const models = database.getModels();

module.exports = {
  orm: database.orm,
  Client: models.Client,
  Order: models.Order,
  Product: models.Product,
  OrderItem: models.OrderItem,
  Payment: models.Payment,
};
