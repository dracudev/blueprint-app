const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const {
  validateClientSetup,
  validateClientUpdate,
} = require("../validations/clientValidation");

router.get("/setup", clientController.showSetup);
router.post("/setup", validateClientSetup, clientController.processSetup);

router.get("/profile", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  if (req.session.user.role === "registered") {
    return res.redirect("/client/setup");
  }

  if (req.session.user.role === "admin") {
    return res.redirect("/dashboard?tab=clients");
  }

  if (req.session.user.role === "client") {
    try {
      const ClientService = require("../services/ClientService");
      const client = await ClientService.findByEmail(req.session.user.email);

      if (client) {
        return res.redirect(`/client/${client.clientId}`);
      } else {
        return res.redirect("/client/setup");
      }
    } catch (error) {
      console.error("Error redirecting to profile:", error);
      return res.redirect("/client/setup");
    }
  }

  return res.redirect("/dashboard");
});

router.get("/data", clientController.getClientData);

router.get("/:id", clientController.showClientDetail);

module.exports = router;
