const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const { jwtAuth } = require("../../middleware/auth");
const {
  validateAdminClient,
  validateClientUpdate,
} = require("../../validations/clientValidation");

router.get("/", jwtAuth, clientController.list);

router.post(
  "/",
  jwtAuth,
  validateAdminClient,
  clientController.adminCreateClient
);

router.put("/:id", jwtAuth, validateClientUpdate, clientController.update);

router.delete("/:id", jwtAuth, clientController.remove);

module.exports = router;
