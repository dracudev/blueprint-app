const ServiceService = require("../services/ServiceService");

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
      if (!req.user.canCreateServices)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const serviceData = req.body;
      const service = await ServiceService.create(serviceData);
      res
        .status(201)
        .json({ success: true, message: "Service created", service });
    } catch (error) {
      console.error("Error creating service:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to create service" });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.user.canEditServices)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const serviceId = req.params.id;
      const updateData = req.body;
      const updated = await ServiceService.update(serviceId, updateData);
      res.json({ success: true, message: "Service updated", service: updated });
    } catch (error) {
      console.error("Error updating service:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to update service" });
    }
  },
  remove: async (req, res) => {
    try {
      if (!req.user.canDeleteServices)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const serviceId = req.params.id;
      await ServiceService.remove(serviceId);
      res.json({ success: true, message: "Service deleted" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to delete service" });
    }
  },
};

module.exports = serviceController;
