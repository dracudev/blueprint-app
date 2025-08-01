const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/projectController");
const { jwtAuth } = require("../../middleware/auth");

router.get("/", jwtAuth, projectController.list);

router.post("/", jwtAuth, projectController.create);

router.put("/:id", jwtAuth, projectController.update);

router.delete("/:id", jwtAuth, projectController.remove);

module.exports = router;
