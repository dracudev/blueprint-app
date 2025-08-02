const express = require("express");
const router = express.Router();

router.get("/", async function (req, res) {
  try {
    const ProjectService = require("../services/ProjectService");
    const projects = await ProjectService.getAll();
    res.render("projects", {
      title: "All Projects",
      user: req.session.user,
      projects: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.render("projects", {
      title: "All Projects",
      user: req.session.user,
      projects: [],
    });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const ProjectService = require("../services/ProjectService");
    const project = await ProjectService.getById(req.params.id);

    if (!project) {
      return res.status(404).render("error", {
        title: "Project Not Found",
        message: "The requested project could not be found.",
        user: req.session.user,
      });
    }

    res.render("project-detail", {
      title: `Project #${project.projectId}`,
      project: project,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "An error occurred while loading the project.",
      user: req.session.user,
    });
  }
});

module.exports = router;
