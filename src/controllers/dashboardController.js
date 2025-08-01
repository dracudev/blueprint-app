const ClientService = require("../services/ClientService");
const ServiceService = require("../services/ServiceService");
const ProjectService = require("../services/ProjectService");
const crudFormConfigs = require("../config/crudFormConfigs");

const { getDashboardPermissions } = require("../middleware/auth");

const dashboardController = {
  renderDashboard: async (req, res) => {
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
    const tab = req.query.tab || "clients";
    let title = "Dashboard";
    if (tab === "clients")
      title = user.role === "admin" ? "Manage Clients" : "My Profile";
    if (tab === "services")
      title = user.role === "admin" ? "Manage Services" : "Available Services";
    if (tab === "projects")
      title = user.role === "admin" ? "Manage Projects" : "My Projects";

    let crudForm = null;
    if (
      req.query.action === "delete" &&
      req.query.entity === "client" &&
      req.query.id &&
      user.role === "admin" &&
      permissions.canDeleteClients
    ) {
      try {
        await ClientService.remove(req.query.id);
        return res.redirect(`/dashboard?tab=clients&success=1`);
      } catch (error) {
        console.error("Error deleting client from dashboard:", error);
        return res.status(500).render("error", {
          title: "Error",
          message: "Unable to delete client.",
          user,
        });
      }
    }

    if (
      req.query.action === "delete" &&
      req.query.entity === "service" &&
      req.query.id &&
      user.role === "admin" &&
      permissions.canDeleteProducts
    ) {
      try {
        await ServiceService.remove(req.query.id);
        return res.redirect(`/dashboard?tab=services&success=1`);
      } catch (error) {
        console.error("Error deleting service from dashboard:", error);
        return res.status(500).render("error", {
          title: "Error",
          message: "Unable to delete service.",
          user,
        });
      }
    }

    if (req.query.action === "create" || req.query.action === "edit") {
      let entity = req.query.entity;
      if (entity && crudFormConfigs[entity]) {
        crudForm = { ...crudFormConfigs[entity] };
        if (entity === "client" && req.query.action === "edit") {
          crudForm.fields = crudForm.fields.filter(
            (f) => f.name !== "password"
          );
          crudForm.action = "/dashboard";
          crudForm.method = "POST";
          crudForm.clientId = req.query.id; // Pass the client ID for edit operations
        }
        if (entity === "client" && req.query.action !== "edit") {
          crudForm.action = "/dashboard";
          crudForm.method = "POST";
        }
        if (entity === "service" && req.query.action === "edit") {
          crudForm.action = "/dashboard";
          crudForm.method = "POST";
          crudForm.serviceId = req.query.id;
        }
        if (entity === "service" && req.query.action !== "edit") {
          crudForm.action = "/dashboard";
          crudForm.method = "POST";
        }
        if (entity === "project" && user.role === "admin") {
          crudForm.fields = crudForm.fields.map((f) =>
            f.name === "client_id"
              ? {
                  ...f,
                  options: clients.map((c) => ({
                    value: c.client_id,
                    label: c.name,
                  })),
                }
              : f
          );
        }
        let cancelUrl = `/dashboard?tab=${tab}`;
        if (req.query.action === "edit" && req.query.id) {
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
                client_id: project.client_id,
                project_name: project.project_name || "",
                description: project.description || "",
                total_amount: project.total_amount || "",
                job_status: project.job_status || "pending",
              };
            }
          }
          crudForm.formData = formData;
        } else {
          crudForm.formData = req.query.formData || {};
        }
        crudForm.isEdit = req.query.action === "edit";
        crudForm.cancelUrl = cancelUrl;
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
    });
  },
};

module.exports = dashboardController;
