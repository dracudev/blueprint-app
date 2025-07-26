module.exports = {
  name: "OrderItem",
  fields: {
    orderItemId: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    orderId: {
      type: "INTEGER",
      allowNull: false,
      references: {
        model: "Order",
        key: "orderId",
      },
    },
    productId: {
      type: "INTEGER",
      allowNull: false,
      references: {
        model: "Product",
        key: "productId",
      },
    },
    quantity: {
      type: "INTEGER",
      allowNull: false,
    },
    unitPrice: {
      type: "DECIMAL",
      precision: 10,
      scale: 2,
      allowNull: false,
    },
  },
  associations: {
    belongsTo: [
      {
        model: "Order",
        foreignKey: "orderId",
        as: "order",
      },
      {
        model: "Product",
        foreignKey: "productId",
        as: "product",
      },
    ],
  },
  tableName: "OrderItems",
};
