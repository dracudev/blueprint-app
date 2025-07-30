const express = require("express");
const router = express.Router();
const serviceController = require("../../controllers/serviceController");
const { jwtAuth } = require("../../middleware/auth");

router.get("/", jwtAuth, serviceController.list);
router.post("/", jwtAuth, serviceController.create);
router.put("/:id", jwtAuth, serviceController.update);
router.delete("/:id", jwtAuth, serviceController.remove);

module.exports = router;
