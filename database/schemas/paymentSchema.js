module.exports = {
  name: "Payment",
  fields: {
    paymentId: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    projectId: {
      type: "INTEGER",
      allowNull: false,
      references: {
        model: "Project",
        key: "projectId",
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
      defaultValue: 0.0,
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
        model: "Project",
        foreignKey: "projectId",
        as: "project",
      },
    ],
  },
  tableName: "Payments",
};
