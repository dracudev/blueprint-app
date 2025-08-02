const express = require("express");
const router = express.Router();
const { jwtAuth } = require("../middleware/auth");

const authRoutes = require("./authRoutes");
const clientRoutes = require("./clientRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const servicesRoutes = require("./servicesRoutes");
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

router.use("/auth", authRoutes);
router.use("/client", jwtAuth, clientRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/services", servicesRoutes);

router.use("/api/clients", clientApiRoutes);
router.use("/api/services", serviceApiRoutes);
router.use("/api/projects", projectApiRoutes);

module.exports = router;
