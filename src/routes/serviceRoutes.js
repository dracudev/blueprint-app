const express = require("express");
const router = express.Router();

router.get("/", async function (req, res) {
  try {
    const ServiceService = require("../services/ServiceService");
    const services = await ServiceService.getAll();
    res.render("services", {
      title: "Our Services",
      user: req.session.user,
      services: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.render("services", {
      title: "Our Services",
      user: req.session.user,
      services: [],
    });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const ServiceService = require("../services/ServiceService");
    const service = await ServiceService.getById(req.params.id);

    if (!service) {
      return res.status(404).render("error", {
        title: "Service Not Found",
        message: "The requested service could not be found.",
        user: req.session.user,
      });
    }

    res.render("service-detail", {
      title: `${service.serviceName}`,
      service: service,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "An error occurred while loading the service.",
      user: req.session.user,
    });
  }
});

module.exports = router;
