const { validationResult } = require("express-validator");
const UserService = require("../services/UserService");
const ClientService = require("../services/ClientService");

const clientController = {
  showProfile: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/auth/login");
      }

      const client = await ClientService.findByEmail(req.session.user.email);

      if (!client) {
        return res.redirect("/client/setup");
      }

      const successMessage = req.session.successMessage;
      delete req.session.successMessage;

      res.render("profile", {
        title: "My Profile",
        user: req.session.user,
        client: client,
        successMessage: successMessage,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      res.status(500).render("error", {
        title: "Error",
        error: {
          status: 500,
          message: "Unable to load profile information",
        },
        user: req.session.user,
      });
    }
  },
  showSetup: async (req, res) => {
    try {
      const existingClient = await ClientService.findByEmail(
        req.session.user.email
      );

      if (existingClient) {
        return res.redirect("/client/profile");
      }

      res.render("client-setup", {
        title: "Client Setup",
        user: req.session.user,
        formData: {},
        errors: [],
      });
    } catch (error) {
      console.error("Error showing client setup:", error);
      res.status(500).render("error", {
        title: "Error",
        error: {
          status: 500,
          message: "Unable to load client setup form",
        },
        user: req.session.user,
      });
    }
  },

  processSetup: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).render("client-setup", {
          title: "Client Setup",
          user: req.session.user,
          formData: req.body,
          errors: errors.array(),
        });
      }

      const {
        isCompany,
        companyName,
        firstName,
        lastName,
        phone,
        billingAddress,
      } = req.body;

      const isCompanyBool = isCompany === "true";

      if (isCompanyBool && !companyName) {
        return res.status(400).render("client-setup", {
          title: "Client Setup",
          user: req.session.user,
          formData: req.body,
          errors: [{ msg: "Company name is required for business accounts" }],
        });
      }

      if (!isCompanyBool && (!firstName || !lastName)) {
        return res.status(400).render("client-setup", {
          title: "Client Setup",
          user: req.session.user,
          formData: req.body,
          errors: [
            {
              msg: "First name and last name are required for individual accounts",
            },
          ],
        });
      }

      const existingClient = await ClientService.findByEmail(
        req.session.user.email
      );

      if (existingClient) {
        return res.status(400).render("client-setup", {
          title: "Client Setup",
          user: req.session.user,
          formData: req.body,
          errors: [{ msg: "Client profile already exists for this email" }],
        });
      }

      const clientData = {
        isCompany: isCompanyBool,
        companyName: isCompanyBool ? companyName : null,
        firstName: !isCompanyBool ? firstName : null,
        lastName: !isCompanyBool ? lastName : null,
        email: req.session.user.email,
        phone: phone || null,
        billingAddress: billingAddress || null,
      };

      const client = await ClientService.create(clientData);
      // Update user role to 'client' in DB, session and JWT
      await UserService.updateRoleByEmail(req.session.user.email, "client");
      req.session.user.role = "client";
      const { signJwt } = require("../utils/jwt");
      const { exp, iat, ...userPayload } = req.session.user;
      req.session.jwt = signJwt(userPayload);

      console.log("Client created successfully:", client);

      req.session.successMessage = "Client profile created successfully!";
      res.redirect("/client/profile");
    } catch (error) {
      console.error("Error processing client setup:", error);
      res.status(500).render("client-setup", {
        title: "Client Setup",
        user: req.session.user,
        formData: req.body,
        errors: [
          { msg: "An error occurred while setting up your client profile" },
        ],
      });
    }
  },

  showEdit: async (req, res) => {
    try {
      const client = await ClientService.findByEmail(req.session.user.email);

      if (!client) {
        return res.redirect("/client/setup");
      }

      res.render("client-setup", {
        title: "Edit Profile",
        user: req.session.user,
        formData: {
          isCompany: client.isCompany.toString(),
          companyName: client.companyName || "",
          firstName: client.firstName || "",
          lastName: client.lastName || "",
          email: client.email,
          phone: client.phone || "",
          billingAddress: client.billingAddress || "",
        },
        errors: [],
        isEdit: true,
      });
    } catch (error) {
      console.error("Error showing client profile:", error);
      res.status(500).render("error", {
        title: "Error",
        error: {
          status: 500,
          message: "Unable to load client profile",
        },
        user: req.session.user,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).render("client-setup", {
          title: "Edit Profile",
          user: req.session.user,
          formData: req.body,
          errors: errors.array(),
          isEdit: true,
        });
      }

      const client = await ClientService.findByEmail(req.session.user.email);

      if (!client) {
        return res.status(404).render("error", {
          title: "Error",
          error: {
            status: 404,
            message: "Client profile not found",
          },
          user: req.session.user,
        });
      }

      const {
        isCompany,
        companyName,
        firstName,
        lastName,
        phone,
        billingAddress,
      } = req.body;

      const isCompanyBool = isCompany === "true";

      if (isCompanyBool && !companyName) {
        return res.status(400).render("client-setup", {
          title: "Edit Profile",
          user: req.session.user,
          formData: req.body,
          errors: [{ msg: "Company name is required for business accounts" }],
          isEdit: true,
        });
      }

      if (!isCompanyBool && (!firstName || !lastName)) {
        return res.status(400).render("client-setup", {
          title: "Edit Client Profile",
          user: req.session.user,
          formData: req.body,
          errors: [
            {
              msg: "First name and last name are required for individual accounts",
            },
          ],
          isEdit: true,
        });
      }

      const updateData = {
        isCompany: isCompanyBool,
        companyName: isCompanyBool ? companyName : null,
        firstName: !isCompanyBool ? firstName : null,
        lastName: !isCompanyBool ? lastName : null,
        phone: phone || null,
        billingAddress: billingAddress || null,
      };

      await ClientService.updateByEmail(req.session.user.email, updateData);

      console.log("Client updated successfully:", updateData);

      if (
        req.headers["content-type"] &&
        req.headers["content-type"].includes("application/json")
      ) {
        res.json({
          success: true,
          message: "Client profile updated successfully",
        });
      } else {
        req.session.successMessage = "Client profile updated successfully!";
        res.redirect("/client/profile");
      }
    } catch (error) {
      console.error("Error updating client profile:", error);

      if (
        req.headers["content-type"] &&
        req.headers["content-type"].includes("application/json")
      ) {
        res.status(500).json({
          success: false,
          message: "Unable to update client profile",
        });
      } else {
        res.status(500).render("client-setup", {
          title: "Edit Client Profile",
          user: req.session.user,
          formData: req.body,
          errors: [
            { msg: "An error occurred while updating your client profile" },
          ],
          isEdit: true,
        });
      }
    }
  },

  getClientData: async (req, res) => {
    try {
      const client = await ClientService.findWithOrdersByEmail(
        req.session.user.email
      );

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client profile not found",
        });
      }

      res.json({
        success: true,
        client: client,
      });
    } catch (error) {
      console.error("Error fetching client data:", error);
      res.status(500).json({
        success: false,
        message: "Unable to fetch client data",
      });
    }
  },

  list: async (req, res) => {
    try {
      const user = req.user;
      let clients;
      if (user.role === "admin") {
        clients = await ClientService.getAll();
      } else {
        clients = await ClientService.getByUser(user.id);
      }
      res.json({ success: true, clients });
    } catch (error) {
      console.error("Error listing clients:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to fetch clients" });
    }
  },

  create: async (req, res) => {
    try {
      if (!req.user.canCreateClients)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const clientData = req.body;
      const client = await ClientService.create(clientData);
      res
        .status(201)
        .json({ success: true, message: "Client created", client });
    } catch (error) {
      console.error("Error creating client:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to create client" });
    }
  },

  update: async (req, res) => {
    try {
      if (!req.user.canEditClients)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const clientId = req.params.id;
      const updateData = req.body;
      const updated = await ClientService.update(clientId, updateData);
      res.json({ success: true, message: "Client updated", client: updated });
    } catch (error) {
      console.error("Error updating client:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to update client" });
    }
  },

  remove: async (req, res) => {
    try {
      if (!req.user.canDeleteClients)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const clientId = req.params.id;
      await ClientService.remove(clientId);
      res.json({ success: true, message: "Client deleted" });
    } catch (error) {
      console.error("Error deleting client:", error);
      res
        .status(500)
        .json({ success: false, message: "Unable to delete client" });
    }
  },
};

module.exports = clientController;
