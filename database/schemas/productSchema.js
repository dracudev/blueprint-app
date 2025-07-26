module.exports = {
  name: "Product",
  fields: {
    productId: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    productName: {
      type: "STRING",
      allowNull: false,
    },
  },
  associations: {
    hasMany: [
      {
        model: "OrderItem",
        foreignKey: "productId",
        as: "orderItems",
      },
    ],
  },
  tableName: "Products",
};
