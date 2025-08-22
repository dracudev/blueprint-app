let express = require("express");
let app = express();

// Config for Swagger
const { setupSwagger } = require("./swagger");
setupSwagger(app);

let path = require("path");
let ejs = require("ejs");
require("dotenv").config({ path: "./.env" });

const { configureSession } = require("./src/middleware/session");
const { helmetMiddleware, limiter } = require("./src/middleware/security");
const database = require("./database");
const routes = require("./src/routes/index");

// Config for limiter on Vercel
app.set("trust proxy", 1);

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.engine("ejs", (filePath, data, callback) => {
  ejs.renderFile(
    filePath,
    data,
    {
      views: [path.join(__dirname, "src", "views")],
      filename: filePath,
    },
    callback
  );
});

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(configureSession());
app.use(helmetMiddleware);
app.use(limiter);

// Routes
app.use("/", routes);

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  async function startServer() {
    try {
      await database.connect();
      const port = process.env.PORT || 3000;

      app.listen(port, "0.0.0.0", () => {
        console.log(`✅ Server listening on port ${port}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
      });
    } catch (error) {
      console.error("❌ Unable to connect to the database:", error);
      process.exit(1);
    }
  }

  startServer();

  process.on("SIGINT", async () => {
    console.log("🛑 Shutting down gracefully...");
    await database.disconnect();
    process.exit(0);
  });
} else {
  database.connect().catch((err) => {
    console.error("❌ Database connection warning in serverless:", err);
  });
}

// Export the app for serverless environments
module.exports = app;
