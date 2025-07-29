module.exports = {
  name: "ProjectItem",
  fields: {
    projectItemId: {
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
    serviceId: {
      type: "INTEGER",
      allowNull: false,
      references: {
        model: "Service",
        key: "serviceId",
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
        model: "Project",
        foreignKey: "projectId",
        as: "project",
      },
      {
        model: "Service",
        foreignKey: "serviceId",
        as: "service",
      },
    ],
  },
  tableName: "ProjectItems",
};
