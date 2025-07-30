const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const { jwtAuth } = require("../../middleware/auth");

router.get("/", jwtAuth, clientController.list);
router.post("/", jwtAuth, clientController.create);
router.put("/:id", jwtAuth, clientController.update);
router.delete("/:id", jwtAuth, clientController.remove);

module.exports = router;
