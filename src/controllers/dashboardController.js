const ClientService = require("../services/ClientService");
const ServiceService = require("../services/ServiceService");
const ProjectService = require("../services/ProjectService");
const crudFormConfigs = require("../config/crudFormConfigs");

const { getDashboardPermissions } = require("../middleware/auth");

const dashboardController = {
  renderDashboard: async (req, res) => {
    try {
      const user = req.user;
      let clients = [],
        services = [],
        projects = [];

      if (user.role === "admin") {
        clients = await ClientService.getAll();
        services = await ServiceService.getAll();
        projects = await ProjectService.getAll();
      } else {
        clients = await ClientService.getByUser(user);
        services = await ServiceService.getByUser(user);
        projects = await ProjectService.getByUser(user);
      }

      const permissions = getDashboardPermissions(user);
      const tab =
        req.query.tab || (user.role === "client" ? "projects" : "clients");

      let title = "Dashboard";
      if (tab === "clients")
        title = user.role === "admin" ? "Manage Clients" : "My Profile";
      if (tab === "services")
        title =
          user.role === "admin" ? "Manage Services" : "Available Services";
      if (tab === "projects")
        title = user.role === "admin" ? "Manage Projects" : "My Projects";

      let crudForm = null;
      let userClient = null;

      if (user.role !== "admin") {
        try {
          const clientByEmail = await ClientService.findByEmail(user.email);
          if (clientByEmail) {
            userClient = clientByEmail;
          }
        } catch (error) {
          console.log("No client found for user email:", user.email);
        }
      }

      if (req.query.action === "create" || req.query.action === "edit") {
        const entity = req.query.entity;
        if (entity && crudFormConfigs[entity]) {
          crudForm = { ...crudFormConfigs[entity] };
          crudForm.entity = entity;

          if (req.query.action === "edit" && req.query.id) {
            crudForm.isEdit = true;
            crudForm.entityId = req.query.id;

            if (entity === "client") {
              crudForm.clientId = req.query.id;
            } else if (entity === "service") {
              crudForm.serviceId = req.query.id;
            } else if (entity === "project") {
              crudForm.projectId = req.query.id;
            }

            let formData = {};
            if (entity === "client") {
              const client = await ClientService.getById(req.query.id);
              if (client) {
                formData = {
                  isCompany: client.isCompany ? "true" : "false",
                  companyName: client.companyName || "",
                  firstName: client.firstName || "",
                  lastName: client.lastName || "",
                  email: client.email,
                  phone: client.phone || "",
                  billingAddress: client.billingAddress || "",
                };
                // Remove password field for edit
                crudForm.fields = crudForm.fields.filter(
                  (f) => f.name !== "password"
                );
              }
            } else if (entity === "service") {
              const service = await ServiceService.getById(req.query.id);
              if (service) {
                formData = {
                  service_name: service.serviceName || "",
                  description: service.description || "",
                  price: service.price || "",
                };
              }
            } else if (entity === "project") {
              const project = await ProjectService.getById(req.query.id);
              if (project) {
                formData = {
                  client_id: project.clientId,
                  total_amount: project.totalAmount || "",
                  paid_amount: project.paidAmount || "",
                  job_status: project.jobStatus || "RECEIVED",
                  services: JSON.stringify(
                    project.projectItems.map((item) => ({
                      serviceId: item.serviceId,
                      service_name: item.service.serviceName,
                      quantity: item.quantity,
                      unitPrice: item.unitPrice,
                    }))
                  ),
                };
              }
              crudForm.fields = crudForm.fields.map((f) => {
                if (f.name === "client_id") {
                  return {
                    ...f,
                    options: clients.map((c) => ({
                      value: c.clientId,
                      label: c.isCompany
                        ? c.companyName
                        : `${c.firstName} ${c.lastName}`,
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
            }
            crudForm.formData = formData;
          } else {
            crudForm.isEdit = false;
            crudForm.formData = {};

            if (entity === "project") {
              crudForm.fields = crudForm.fields.map((f) => {
                if (f.name === "client_id") {
                  return {
                    ...f,
                    options: clients.map((c) => ({
                      value: c.clientId,
                      label: c.isCompany
                        ? c.companyName
                        : `${c.firstName} ${c.lastName}`,
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
            }
          }

          crudForm.cancelUrl = `/dashboard?tab=${tab}`;
        }
      }

      res.render("dashboard", {
        title,
        user: { ...user, ...permissions },
        clients,
        services,
        projects,
        currentTab: tab,
        crudForm,
        userClient,
      });
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      res.status(500).render("error", {
        title: "Error",
        error: {
          status: 500,
          message: "Unable to load dashboard",
        },
        user: req.user,
      });
    }
  },
};

module.exports = dashboardController;
