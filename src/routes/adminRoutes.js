const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.get("/dashboard", function (req, res, next) {
  return projectController.list(req, res);
});

module.exports = router;
