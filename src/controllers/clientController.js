const { validationResult } = require("express-validator");
const models = require("../models");

const clientController = {
  showProfile: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/auth/login");
      }

      const client = await models.Client.findFirst({
        where: { email: req.session.user.email },
      });

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
      const existingClient = await models.Client.findFirst({
        where: { email: req.session.user.email },
      });

      if (existingClient) {
        return res.redirect("/user/profile");
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

      const existingClient = await models.Client.findFirst({
        where: { email: req.session.user.email },
      });

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

      const client = await models.Client.create({
        data: clientData,
      });

      console.log("Client created successfully:", client);

      req.session.successMessage = "Client profile created successfully!";
      res.redirect("/user/profile");
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
      const client = await models.Client.findFirst({
        where: { email: req.session.user.email },
      });

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

      const client = await models.Client.findFirst({
        where: { email: req.session.user.email },
      });

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

      await models.Client.update({
        where: { email: req.session.user.email },
        data: updateData,
      });

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
        res.redirect("/user/profile");
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
      const client = await models.Client.findFirst({
        where: { email: req.session.user.email },
        include: {
          orders: {
            include: {
              orderItems: {
                include: {
                  product: true,
                },
              },
              payments: true,
            },
          },
        },
      });

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
};

module.exports = clientController;
