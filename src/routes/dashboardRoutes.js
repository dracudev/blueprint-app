const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const clientController = require("../controllers/clientController");
const { jwtAuth } = require("../middleware/auth");

const { validateAdminClient } = require("../validations/clientValidation");

router.get("/", jwtAuth, dashboardController.renderDashboard);
router.post(
  "/",
  jwtAuth,
  validateAdminClient,
  clientController.adminCreateClient
);

module.exports = router;
