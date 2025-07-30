const ProjectService = require("../services/ProjectService");

const projectController = {
  list: async (req, res) => {
    try {
      const user = req.user;
      let projects;
      if (user.role === "admin") {
        projects = await ProjectService.getAll();
      } else {
        projects = await ProjectService.getByUser(user.id);
      }
      res.json({ success: true, projects });
    } catch (error) {
      console.error("Error listing projects:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to fetch projects" });
    }
  },
  create: async (req, res) => {
    try {
      if (!req.user.canCreateProjects)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const projectData = req.body;
      const project = await ProjectService.create(projectData);
      res
        .status(201)
        .json({ success: true, message: "Project created", project });
    } catch (error) {
      console.error("Error creating project:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to create project" });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.user.canEditProjects)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const projectId = req.params.id;
      const updateData = req.body;
      const updated = await ProjectService.update(projectId, updateData);
      res.json({ success: true, message: "Project updated", project: updated });
    } catch (error) {
      console.error("Error updating project:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to update project" });
    }
  },
  remove: async (req, res) => {
    try {
      if (!req.user.canDeleteProjects)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const projectId = req.params.id;
      await ProjectService.remove(projectId);
      res.json({ success: true, message: "Project deleted" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to delete project" });
    }
  },
};

module.exports = projectController;
