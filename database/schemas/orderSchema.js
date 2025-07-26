module.exports = {
  name: "Order",
  fields: {
    orderId: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    clientId: {
      type: "INTEGER",
      allowNull: false,
      references: {
        model: "Client",
        key: "clientId",
      },
    },
    createdAt: {
      type: "DATE",
      allowNull: false,
      defaultValue: "NOW",
    },
    jobStatus: {
      type: "ENUM",
      values: ["Received", "In Progress", "Completed", "Delivered"],
      defaultValue: "Received",
      allowNull: false,
    },
    totalAmount: {
      type: "DECIMAL",
      precision: 10,
      scale: 2,
      defaultValue: 0.00,
      allowNull: false,
    },
  },
  associations: {
    belongsTo: [
      {
        model: "Client",
        foreignKey: "clientId",
        as: "client",
      },
    ],
    hasMany: [
      {
        model: "OrderItem",
        foreignKey: "orderId",
        as: "orderItems",
      },
      {
        model: "Payment",
        foreignKey: "orderId",
        as: "payments",
      },
    ],
  },
  tableName: "Orders",
};
