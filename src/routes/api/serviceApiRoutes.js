const express = require("express");
const router = express.Router();
const serviceController = require("../../controllers/serviceController");
const { jwtAuth } = require("../../middleware/auth");
const { validateService } = require("../../validations/serviceValidation");

router.get("/", jwtAuth, serviceController.list);

router.post("/", jwtAuth, validateService, serviceController.create);

router.put("/:id", jwtAuth, validateService, serviceController.update);

router.delete("/:id", jwtAuth, serviceController.remove);

module.exports = router;
