const database = require("../../database");

// Export a getter function that will get models when they're available
module.exports = {
  get orm() {
    return database.orm;
  },
  get User() {
    return database.getModels().User;
  },
  get Client() {
    return database.getModels().Client;
  },
  get Order() {
    return database.getModels().Order;
  },
  get Product() {
    return database.getModels().Product;
  },
  get OrderItem() {
    return database.getModels().OrderItem;
  },
  get Payment() {
    return database.getModels().Payment;
  },
};
