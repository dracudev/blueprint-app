const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { jwtAuth } = require("../middleware/auth");

router.get("/", jwtAuth, dashboardController.renderDashboard);

module.exports = router;
