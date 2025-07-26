module.exports = {
  name: "Payment",
  fields: {
    paymentId: {
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
    paymentStatus: {
      type: "ENUM",
      values: ["Paid", "Partially Paid", "Unpaid"],
      defaultValue: "Unpaid",
      allowNull: false,
    },
    paidAmount: {
      type: "DECIMAL",
      precision: 10,
      scale: 2,
      defaultValue: 0.00,
      allowNull: false,
    },
    paymentDate: {
      type: "DATE",
      allowNull: false,
      defaultValue: "NOW",
    },
  },
  associations: {
    belongsTo: [
      {
        model: "Order",
        foreignKey: "orderId",
        as: "order",
      },
    ],
  },
  tableName: "Payments",
};
