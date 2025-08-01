module.exports = {
  name: "Client",
  fields: {
    clientId: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    isCompany: {
      type: "BOOLEAN",
      allowNull: false,
    },
    companyName: {
      type: "STRING",
      allowNull: true,
    },
    firstName: {
      type: "STRING",
      allowNull: true,
    },
    lastName: {
      type: "STRING",
      allowNull: true,
    },
    email: {
      type: "STRING",
      allowNull: false,
    },
    phone: {
      type: "STRING",
      allowNull: true,
    },
    billingAddress: {
      type: "TEXT",
      allowNull: true,
    },
  },
  associations: {
    hasMany: [
      {
        model: "Project",
        foreignKey: "clientId",
        as: "projects",
      },
    ],
  },
  tableName: "Clients",
};
