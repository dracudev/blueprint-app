const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const {
  validateClientSetup,
  validateClientUpdate,
} = require("../validations/clientValidation");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.get("/setup", clientController.showSetup);
router.post("/setup", validateClientSetup, clientController.processSetup);

router.get("/profile", clientController.showEdit);
router.post("/profile", validateClientUpdate, clientController.updateProfile);

router.get("/edit", clientController.showEdit);
router.get("/data", clientController.getClientData);
router.put("/edit", validateClientUpdate, clientController.updateProfile);
router.post("/edit", validateClientUpdate, clientController.updateProfile);

module.exports = router;
