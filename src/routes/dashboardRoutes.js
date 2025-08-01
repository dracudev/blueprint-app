const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const clientController = require("../controllers/clientController");
const { jwtAuth } = require("../middleware/auth");

const { validateAdminClient } = require("../validations/clientValidation");

router.get("/", jwtAuth, dashboardController.renderDashboard);
router.post("/", jwtAuth, validateAdminClient, (req, res, next) => {
  if (req.body.clientId) {
    req.params.id = req.body.clientId;
    return clientController.update(req, res, next);
  } else {
    return clientController.adminCreateClient(req, res, next);
  }
});

module.exports = router;
