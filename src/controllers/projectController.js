const ProjectService = require("../services/ProjectService");
const { validationResult } = require("express-validator");

const projectController = {
  list: async (req, res) => {
    try {
      const user = req.user;
      let projects;
      if (user.role === "admin") {
        projects = await ProjectService.getAll();
      } else {
        projects = await ProjectService.getByUser(user);
      }

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: true,
          projects: projects,
        });
      }

      res.render("dashboard", {
        title: user.role === "admin" ? "Manage Projects" : "My Projects",
        user,
        projects,
        currentTab: "projects",
      });
    } catch (error) {
      console.error("Error listing projects:", error);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          success: false,
          message: "Unable to fetch projects",
        });
      }

      res.status(500).render("error", {
        title: "Error",
        message: "Unable to fetch projects.",
        user: req.user,
      });
    }
  },

  create: async (req, res) => {
    try {
      if (!req.user.canCreateProjects) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to create projects.",
          });
        }

        return res.status(403).render("error", {
          title: "Forbidden",
          message: "You do not have permission to create projects.",
          user: req.user,
        });
      }

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
          });
        }

        return await projectController.renderCreateDashboardWithError(
          req,
          res,
          errors.array()
        );
      }

      const projectData = req.body;
      const project = await ProjectService.create(projectData);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(201).json({
          success: true,
          message: "Project created successfully",
          project: project,
        });
      }

      res.redirect("/dashboard?tab=projects&success=1");
    } catch (error) {
      console.error("Error creating project:", error);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          success: false,
          message: "Unable to create project",
        });
      }

      res.status(500).render("error", {
        title: "Error",
        message: "Unable to create project.",
        user: req.user,
      });
    }
  },

  update: async (req, res) => {
    try {
      if (!req.user.canEditProjects) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to edit projects.",
          });
        }

        return res.status(403).render("error", {
          title: "Forbidden",
          message: "You do not have permission to edit projects.",
          user: req.user,
        });
      }

      const { id } = req.params;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
          });
        }

        return await projectController.renderUpdateDashboardWithError(
          req,
          res,
          id,
          errors.array()
        );
      }

      const updateData = req.body;
      const updated = await ProjectService.update(id, updateData);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: true,
          message: "Project updated successfully",
          project: updated,
        });
      }

      res.redirect("/dashboard?tab=projects&success=1");
    } catch (error) {
      console.error("Error updating project:", error);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          success: false,
          message: "Unable to update project",
        });
      }

      res.status(500).render("error", {
        title: "Error",
        error: {
          status: 500,
          message: "Unable to update project.",
        },
        user: req.user,
      });
    }
  },

  renderCreateDashboardWithError: async function (req, res, errors) {
    const ClientService = require("../services/ClientService");
    const ServiceService = require("../services/ServiceService");
    const crudFormConfigs = require("../config/crudFormConfigs");
    const { getDashboardPermissions } = require("../middleware/auth");

    let clients, services, projects;
    let userClient = null;

    if (req.user.role === "admin") {
      clients = await ClientService.getAll();
      services = await ServiceService.getAll();
      projects = await ProjectService.getAll();
    } else {
      clients = await ClientService.getByUser(req.user);
      services = await ServiceService.getByUser(req.user);
      projects = await ProjectService.getByUser(req.user);

      // Get the client record for the current user
      try {
        userClient = await ClientService.findByEmail(req.user.email);
      } catch (error) {
        console.log("No client found for user email:", req.user.email);
      }
    }

    const crudForm = { ...crudFormConfigs.project };
    crudForm.entity = "project";
    crudForm.formData = req.body;
    crudForm.errors = errors;

    crudForm.fields = crudForm.fields.map((f) => {
      if (f.name === "client_id") {
        return {
          ...f,
          options: clients.map((c) => ({
            value: c.clientId,
            label: c.isCompany ? c.companyName : `${c.firstName} ${c.lastName}`,
          })),
        };
      } else if (f.name === "services") {
        return {
          ...f,
          services: services,
        };
      }
      return f;
    });

    const permissions = getDashboardPermissions(req.user);

    return res.status(400).render("dashboard", {
      title: "Create Project",
      user: { ...req.user, ...permissions },
      clients,
      services,
      projects,
      currentTab: "projects",
      crudForm,
      userClient,
    });
  },

  renderUpdateDashboardWithError: async function (req, res, projectId, errors) {
    const ClientService = require("../services/ClientService");
    const ServiceService = require("../services/ServiceService");
    const crudFormConfigs = require("../config/crudFormConfigs");
    const { getDashboardPermissions } = require("../middleware/auth");

    let clients, services, projects;
    let userClient = null;

    if (req.user.role === "admin") {
      clients = await ClientService.getAll();
      services = await ServiceService.getAll();
      projects = await ProjectService.getAll();
    } else {
      clients = await ClientService.getByUser(req.user);
      services = await ServiceService.getByUser(req.user);
      projects = await ProjectService.getByUser(req.user);

      try {
        userClient = await ClientService.findByEmail(req.user.email);
      } catch (error) {
        console.log("No client found for user email:", req.user.email);
      }
    }

    const crudForm = { ...crudFormConfigs.project };
    crudForm.entity = "project";
    crudForm.isEdit = true;
    crudForm.projectId = projectId;
    crudForm.cancelUrl = "/dashboard?tab=projects";
    crudForm.formData = req.body;
    crudForm.errors = errors;

    crudForm.fields = crudForm.fields.map((f) => {
      if (f.name === "client_id") {
        return {
          ...f,
          options: clients.map((c) => ({
            value: c.clientId,
            label: c.isCompany ? c.companyName : `${c.firstName} ${c.lastName}`,
          })),
        };
      } else if (f.name === "services") {
        return {
          ...f,
          services: services,
        };
      }
      return f;
    });

    const permissions = getDashboardPermissions(req.user);

    return res.status(400).render("dashboard", {
      title: "Edit Project",
      user: { ...req.user, ...permissions },
      clients,
      services,
      projects,
      currentTab: "projects",
      crudForm,
      userClient,
    });
  },

  remove: async (req, res) => {
    try {
      if (!req.user.canDeleteProjects) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to delete projects.",
          });
        }

        return res.status(403).render("error", {
          title: "Forbidden",
          message: "You do not have permission to delete projects.",
          user: req.user,
        });
      }

      const projectId = req.params.id;
      await ProjectService.remove(projectId);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: true,
          message: "Project deleted successfully",
        });
      }

      res.redirect("/dashboard?tab=projects&success=1");
    } catch (error) {
      console.error("Error deleting project:", error);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          success: false,
          message: "Unable to delete project",
        });
      }

      res.status(500).render("error", {
        title: "Error",
        error: {
          status: 500,
          message: "Unable to delete project.",
        },
        user: req.user,
      });
    }
  },
};

module.exports = projectController;
