const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const clientController = require("../controllers/clientController");
const serviceController = require("../controllers/serviceController");
const { jwtAuth } = require("../middleware/auth");

const { validateAdminClient } = require("../validations/clientValidation");
const { validateService } = require("../validations/serviceValidation");

router.get("/", jwtAuth, dashboardController.renderDashboard);

function isClientOperation(body) {
  return (
    body.clientId ||
    (!body.serviceId &&
      !body.projectId &&
      (body.isCompany !== undefined || body.email))
  );
}

function isServiceOperation(body) {
  return body.serviceId || body.service_name;
}

router.post("/", jwtAuth, async (req, res, next) => {
  if (isClientOperation(req.body)) {
    for (const validation of validateAdminClient) {
      await validation(req, res, () => {});
    }

    if (req.body.clientId) {
      req.params.id = req.body.clientId;
      return clientController.update(req, res, next);
    } else {
      return clientController.adminCreateClient(req, res, next);
    }
  } else if (isServiceOperation(req.body)) {
    for (const validation of validateService) {
      await validation(req, res, () => {});
    }

    if (req.body.serviceId) {
      req.params.id = req.body.serviceId;
      return serviceController.update(req, res, next);
    } else {
      return serviceController.adminCreateService(req, res, next);
    }
  } else {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }
});

module.exports = router;
