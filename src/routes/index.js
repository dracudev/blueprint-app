const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const clientRoutes = require("./clientRoutes");
const { jwtAuth } = require("../middleware/auth");

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

router.get("/services", function (req, res) {
  res.render("services", {
    title: "Our Services",
    user: req.session.user,
  });
});

router.get("/dashboard", function (req, res) {
  res.render("dashboard", {
    title: "Our Services",
    user: req.session.user,
  });
});

router.use("/auth", authRoutes);
router.use("/client", jwtAuth, clientRoutes);

module.exports = router;
