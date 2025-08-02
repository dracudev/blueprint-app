const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
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
      const client = await ClientService.findWithProjectsByEmail(
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

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: true,
          clients: clients,
        });
      }

      res.render("dashboard", {
        title: user.role === "admin" ? "Manage Clients" : "My Profile",
        user,
        clients,
        currentTab: "clients",
      });
    } catch (error) {
      console.error("Error listing clients:", error);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          success: false,
          message: "Unable to fetch clients",
        });
      }

      res.status(500).render("error", {
        title: "Error",
        message: "Unable to fetch clients.",
        user: req.user,
      });
    }
  },

  create: async (req, res) => {
    try {
      if (!req.user.canCreateClients) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to create clients.",
          });
        }

        return res.status(403).render("error", {
          title: "Forbidden",
          message: "You do not have permission to create clients.",
          user: req.user,
        });
      }

      const clientData = req.body;
      const newClient = await ClientService.create(clientData);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(201).json({
          success: true,
          message: "Client created successfully",
          client: newClient,
        });
      }

      res.redirect("/dashboard?tab=clients&success=1");
    } catch (error) {
      console.error("Error creating client:", error);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          success: false,
          message: "Unable to create client",
        });
      }

      res.status(500).render("error", {
        title: "Error",
        message: "Unable to create client.",
        user: req.user,
      });
    }
  },

  update: async (req, res) => {
    try {
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

        return await clientController.renderUpdateDashboardWithError(
          req,
          res,
          id,
          errors.array()
        );
      }

      let {
        isCompany,
        companyName,
        firstName,
        lastName,
        email,
        phone,
        billingAddress,
      } = req.body;

      if (typeof isCompany === "string") {
        isCompany = isCompany === "true";
      }

      if (isCompany) {
        if (!companyName) {
          const errorMsg = "Company name is required for business accounts";

          if (
            req.headers.accept &&
            req.headers.accept.includes("application/json")
          ) {
            return res.status(400).json({
              success: false,
              message: errorMsg,
            });
          }

          return await clientController.renderUpdateDashboardWithError(
            req,
            res,
            id,
            [{ msg: errorMsg }]
          );
        }
        firstName = null;
        lastName = null;
      } else {
        if (!firstName || !lastName) {
          const errorMsg =
            "First and last name are required for individual accounts";

          if (
            req.headers.accept &&
            req.headers.accept.includes("application/json")
          ) {
            return res.status(400).json({
              success: false,
              message: errorMsg,
            });
          }

          return await clientController.renderUpdateDashboardWithError(
            req,
            res,
            id,
            [{ msg: errorMsg }]
          );
        }
        companyName = null;
      }

      const updateData = {
        isCompany,
        companyName,
        firstName,
        lastName,
        email,
        phone,
        billingAddress,
      };

      const updatedClient = await ClientService.update(id, updateData);
      console.log("Client updated successfully:", updateData);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: true,
          message: "Client updated successfully",
          client: updatedClient,
        });
      }

      res.redirect("/dashboard?tab=clients&success=1");
    } catch (error) {
      console.error("Error updating client:", error);

      if (error.message && error.message.includes("email")) {
        const errorMsg =
          "Email already exists. Please use a different email address.";

        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(400).json({
            success: false,
            message: errorMsg,
          });
        }

        return await clientController.renderUpdateDashboardWithError(
          req,
          res,
          req.params.id,
          [{ msg: errorMsg }]
        );
      }

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          success: false,
          message: "Unable to update client",
        });
      }

      res.status(500).render("error", {
        title: "Error",
        error: {
          status: 500,
          message: "Unable to update client.",
        },
        user: req.user,
      });
    }
  },

  renderUpdateDashboardWithError: async function (req, res, clientId, errors) {
    const ServiceService = require("../services/ServiceService");
    const ProjectService = require("../services/ProjectService");
    const crudFormConfigs = require("../config/crudFormConfigs");

    const clients = await ClientService.getAll();
    const services = await ServiceService.getAll();
    const projects = await ProjectService.getAll();

    const crudForm = { ...crudFormConfigs.client };
    crudForm.isEdit = true;
    crudForm.clientId = clientId;
    crudForm.cancelUrl = "/dashboard?tab=clients";
    crudForm.fields = crudForm.fields.filter((f) => f.name !== "password");
    crudForm.formData = req.body;
    crudForm.errors = errors;

    console.log("CRUD form data being passed:", {
      formData: crudForm.formData,
      errors: crudForm.errors,
      clientId: crudForm.clientId,
    });

    return res.status(400).render("dashboard", {
      title: "Edit Client",
      user: {
        ...req.user,
        canCreateClients: true,
        canEditClients: true,
        canDeleteClients: true,
      },
      clients,
      services,
      projects,
      currentTab: "clients",
      crudForm,
    });
  },

  remove: async (req, res) => {
    try {
      if (!req.user.canDeleteClients) {
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to delete clients.",
          });
        }

        return res.status(403).render("error", {
          title: "Forbidden",
          message: "You do not have permission to delete clients.",
          user: req.user,
        });
      }

      const clientId = req.params.id;
      await ClientService.remove(clientId);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: true,
          message: "Client deleted successfully",
        });
      }

      res.redirect("/dashboard?tab=clients&success=1");
    } catch (error) {
      console.error("Error deleting client:", error);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          success: false,
          message: "Unable to delete client",
        });
      }

      res.status(500).render("error", {
        title: "Error",
        message: "Unable to delete client.",
        user: req.user,
      });
    }
  },

  adminCreateClient: async (req, res) => {
    try {
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

        return await clientController.renderCreateDashboardWithError(
          req,
          res,
          errors.array()
        );
      }

      let {
        isCompany,
        companyName,
        firstName,
        lastName,
        email,
        password,
        phone,
        billingAddress,
      } = req.body;

      if (typeof isCompany === "string") {
        isCompany = isCompany === "true";
      }

      if (isCompany) {
        if (!companyName) {
          const errorMsg = "Company name is required for business accounts";

          if (
            req.headers.accept &&
            req.headers.accept.includes("application/json")
          ) {
            return res.status(400).json({
              success: false,
              message: errorMsg,
            });
          }

          return await clientController.renderCreateDashboardWithError(
            req,
            res,
            [{ msg: errorMsg }]
          );
        }
        firstName = null;
        lastName = null;
      } else {
        if (!firstName || !lastName) {
          const errorMsg =
            "First and last name are required for individual accounts";

          if (
            req.headers.accept &&
            req.headers.accept.includes("application/json")
          ) {
            return res.status(400).json({
              success: false,
              message: errorMsg,
            });
          }

          return await clientController.renderCreateDashboardWithError(
            req,
            res,
            [{ msg: errorMsg }]
          );
        }
        companyName = null;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      let userName = "";
      if (isCompany && companyName) {
        userName = companyName;
      } else if (firstName && lastName) {
        userName = `${firstName} ${lastName}`;
      }

      await UserService.create({
        email,
        password: hashedPassword,
        role: "client",
        name: userName,
      });

      const clientData = {
        isCompany,
        companyName,
        firstName,
        lastName,
        email,
        phone,
        billingAddress,
      };

      const newClient = await ClientService.create(clientData);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(201).json({
          success: true,
          message: "Client created successfully",
          client: newClient,
        });
      }

      res.redirect("/dashboard?tab=clients&success=1");
    } catch (error) {
      console.error("Error creating client:", error);

      if (error.message && error.message.includes("email")) {
        const errorMsg =
          "Email already exists. Please use a different email address.";

        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(400).json({
            success: false,
            message: errorMsg,
          });
        }

        return await clientController.renderCreateDashboardWithError(req, res, [
          { msg: errorMsg },
        ]);
      }

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          success: false,
          message: "Unable to create client",
        });
      }

      res.status(500).render("error", {
        title: "Error",
        error: {
          status: 500,
          message: "Unable to create client.",
        },
        user: req.user,
      });
    }
  },

  renderCreateDashboardWithError: async function (req, res, errors) {
    const ServiceService = require("../services/ServiceService");
    const ProjectService = require("../services/ProjectService");
    const crudFormConfigs = require("../config/crudFormConfigs");

    const clients = await ClientService.getAll();
    const services = await ServiceService.getAll();
    const projects = await ProjectService.getAll();

    const crudForm = { ...crudFormConfigs.client };
    crudForm.isEdit = false;
    crudForm.cancelUrl = "/dashboard?tab=clients";
    crudForm.fields = crudForm.fields.map((f) =>
      f.name === "password" ? { ...f, required: true } : f
    );
    crudForm.formData = req.body;
    crudForm.errors = errors;

    return res.status(400).render("dashboard", {
      title: "Dashboard",
      user: {
        ...req.user,
        canCreateClients: true,
        canEditClients: true,
        canDeleteClients: true,
      },
      clients,
      services,
      projects,
      currentTab: "clients",
      crudForm,
    });
  },

  showClientDetail: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/auth/login");
      }

      const clientId = req.params.id;

      // Role-based access control
      if (req.session.user.role === "client") {
        // Clients can only view their own profile
        const userClient = await ClientService.findByEmail(
          req.session.user.email
        );
        if (!userClient || userClient.clientId !== Number(clientId)) {
          return res.status(403).render("error", {
            title: "Access Denied",
            message: "You can only view your own profile.",
            user: req.session.user,
          });
        }
      } else if (req.session.user.role !== "admin") {
        // Only admins and clients (with restrictions) can view client details
        return res.status(403).render("error", {
          title: "Access Denied",
          message: "You don't have permission to view client details.",
          user: req.session.user,
        });
      }

      const client = await ClientService.getByIdWithProjects(clientId);

      if (!client) {
        return res.status(404).render("error", {
          title: "Client Not Found",
          message: "The requested client could not be found.",
          user: req.session.user,
        });
      }

      // Calculate project summaries
      let totalProjects = client.projects.length;
      let totalValue = 0;
      let totalPaid = 0;
      let projectsByStatus = {
        RECEIVED: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
        DELIVERED: 0,
      };

      client.projects.forEach((project) => {
        totalValue += Number(project.totalAmount);
        const paidAmount = project.payments.reduce(
          (sum, payment) => sum + Number(payment.paidAmount),
          0
        );
        totalPaid += paidAmount;
        projectsByStatus[project.jobStatus]++;

        // Add calculated paid amount to project
        project.paidAmount = paidAmount;
      });

      res.render("client-detail", {
        title: `${
          client.isCompany
            ? client.companyName
            : client.firstName + " " + client.lastName
        } - Client Details`,
        client: client,
        user: req.session.user,
        summary: {
          totalProjects,
          totalValue,
          totalPaid,
          totalOutstanding: totalValue - totalPaid,
          projectsByStatus,
        },
      });
    } catch (error) {
      console.error("Error fetching client details:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "An error occurred while loading the client details.",
        user: req.session.user,
      });
    }
  },
};

module.exports = clientController;
