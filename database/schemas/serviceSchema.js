module.exports = {
  name: "Service",
  fields: {
    serviceId: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    serviceName: {
      type: "STRING",
      allowNull: false,
    },
  },
  associations: {
    hasMany: [
      {
        model: "ProjectItem",
        foreignKey: "serviceId",
        as: "projectItems",
      },
    ],
  },
  tableName: "Services",
};
