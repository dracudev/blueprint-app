const ServiceService = require("../services/ServiceService");
const { validationResult } = require("express-validator");

const serviceController = {
  list: async (req, res) => {
    try {
      const user = req.user;
      let services;
      if (user.role === "admin") {
        services = await ServiceService.getAll();
      } else {
        services = await ServiceService.getByUser(user.id);
      }
      res.json({ success: true, services });
    } catch (error) {
      console.error("Error listing services:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to fetch services" });
    }
  },
  create: async (req, res) => {
    try {
      if (!req.user.canCreateServices) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(403).json({ success: false, message: "Forbidden" });
        }
        return res.status(403).render("error", {
          title: "Forbidden",
          message: "You do not have permission to create services.",
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

        return await serviceController.renderUpdateDashboardWithError(
          req,
          res,
          null,
          errors.array()
        );
      }

      const serviceData = {
        serviceName: req.body.service_name,
        description: req.body.description || null,
        price: parseFloat(req.body.price),
      };

      const service = await ServiceService.create(serviceData);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res
          .status(201)
          .json({ success: true, message: "Service created", service });
      } else {
        res.redirect("/dashboard?tab=services&success=1");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res
          .status(500)
          .json({ success: false, message: "Unable to create service" });
      } else {
        return await serviceController.renderUpdateDashboardWithError(
          req,
          res,
          null,
          [{ msg: "Unable to create service" }]
        );
      }
    }
  },
  update: async (req, res) => {
    try {
      if (!req.user.canEditServices) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(403).json({ success: false, message: "Forbidden" });
        }
        return res.status(403).render("error", {
          title: "Forbidden",
          message: "You do not have permission to edit services.",
          user: req.user,
        });
      }

      const serviceId = req.params.id || req.body.serviceId;
      if (!serviceId) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res
            .status(400)
            .json({ success: false, message: "Service ID is required" });
        }
        return res.status(400).render("error", {
          title: "Bad Request",
          message: "Service ID is required.",
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

        return await serviceController.renderUpdateDashboardWithError(
          req,
          res,
          serviceId,
          errors.array()
        );
      }

      const updateData = {
        serviceName: req.body.service_name,
        description: req.body.description || null,
        price: parseFloat(req.body.price),
      };

      const updated = await ServiceService.update(serviceId, updateData);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res.json({
          success: true,
          message: "Service updated",
          service: updated,
        });
      } else {
        res.redirect("/dashboard?tab=services&success=1");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res
          .status(500)
          .json({ success: false, message: "Unable to update service" });
      } else {
        const serviceId = req.params.id || req.body.serviceId;
        return await serviceController.renderUpdateDashboardWithError(
          req,
          res,
          serviceId,
          [{ msg: "Unable to update service" }]
        );
      }
    }
  },
  remove: async (req, res) => {
    try {
      if (!req.user.canDeleteServices) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(403).json({ success: false, message: "Forbidden" });
        }
        return res.status(403).render("error", {
          title: "Forbidden",
          message: "You do not have permission to delete services.",
          user: req.user,
        });
      }

      const serviceId = req.params.id;
      await ServiceService.remove(serviceId);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res.json({ success: true, message: "Service deleted" });
      } else {
        res.redirect("/dashboard?tab=services&success=1");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res
          .status(500)
          .json({ success: false, message: "Unable to delete service" });
      } else {
        res.status(500).render("error", {
          title: "Error",
          message: "Unable to delete service.",
          user: req.user,
        });
      }
    }
  },

  renderUpdateDashboardWithError: async function (req, res, serviceId, errors) {
    const ClientService = require("../services/ClientService");
    const ProjectService = require("../services/ProjectService");
    const crudFormConfigs = require("../config/crudFormConfigs");

    const clients = await ClientService.getAll();
    const services = await ServiceService.getAll();
    const projects = await ProjectService.getAll();

    const crudForm = { ...crudFormConfigs.service };
    crudForm.isEdit = !!serviceId;
    crudForm.serviceId = serviceId;
    crudForm.cancelUrl = "/dashboard?tab=services";
    crudForm.formData = req.body;
    crudForm.errors = errors;

    console.log("Service CRUD form data being passed:", {
      formData: crudForm.formData,
      errors: crudForm.errors,
      serviceId: crudForm.serviceId,
    });

    return res.status(400).render("dashboard", {
      title: serviceId ? "Edit Service" : "Create Service",
      user: {
        ...req.user,
        canCreateServices: true,
        canEditServices: true,
        canDeleteServices: true,
      },
      clients,
      services,
      projects,
      currentTab: "services",
      crudForm,
    });
  },

  adminCreateService: async (req, res) => {
    return serviceController.create(req, res);
  },
};

module.exports = serviceController;
