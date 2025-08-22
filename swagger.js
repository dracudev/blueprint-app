const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blueprint API",
      version: "1.0.0",
      description:
        "API documentation for Blueprint web development budgeting app",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js", "./src/routes/api/*.js", "./swagger-docs.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  // Serve Swagger UI static files explicitly for Vercel/serverless
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(
    "/api-docs/static",
    express.static(path.join(__dirname, "node_modules", "swagger-ui-dist"))
  );
}

module.exports = { swaggerSpec, setupSwagger };
