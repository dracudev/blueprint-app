const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/projectController");
const { jwtAuth } = require("../../middleware/auth");
const { validateProject } = require("../../validations/projectValidation");

router.get("/", jwtAuth, projectController.list);

router.post("/", jwtAuth, validateProject, projectController.create);

router.put("/:id", jwtAuth, validateProject, projectController.update);

router.delete("/:id", jwtAuth, projectController.remove);

module.exports = router;
