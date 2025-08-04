const express = require("express");
const router = express.Router();
const { jwtAuth } = require("../middleware/auth");

const authRoutes = require("./authRoutes");
const clientRoutes = require("./clientRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const serviceRoutes = require("./serviceRoutes");
const projectRoutes = require("./projectRoutes");
const clientApiRoutes = require("./api/clientApiRoutes");
const serviceApiRoutes = require("./api/serviceApiRoutes");
const projectApiRoutes = require("./api/projectApiRoutes");

router.get("/", function (req, res) {
  let message;
  if (req.session.user) {
    message = `Welcome, ${req.session.user.name}!`;
  } else {
    message = "You are not logged in.";
  }
  res.render("home", {
    title: "Home",
    message: message,
    user: req.session.user,
  });
});

// Health check endpoint
router.get("/health", function (req, res) {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: require("../../package.json").version,
  });
});

router.use("/auth", authRoutes);
router.use("/client", jwtAuth, clientRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/service", serviceRoutes);
router.use("/project", projectRoutes);

router.use("/api/clients", clientApiRoutes);
router.use("/api/services", serviceApiRoutes);
router.use("/api/projects", projectApiRoutes);

module.exports = router;
