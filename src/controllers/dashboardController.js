const ClientService = require("../services/ClientService");
const ServiceService = require("../services/ServiceService");
const ProjectService = require("../services/ProjectService");
const crudFormConfigs = require("../config/crudFormConfigs");

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
    if (req.query.action === "create" || req.query.action === "edit") {
      let entity = req.query.entity;
      if (entity && crudFormConfigs[entity]) {
        crudForm = { ...crudFormConfigs[entity] };
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
          let values = {};
          if (entity === "client") {
            const client = await ClientService.getById(req.query.id);
            if (client) {
              values = {
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
              values = {
                service_name: service.service_name || "",
                description: service.description || "",
                price: service.price || "",
              };
            }
          } else if (entity === "project") {
            const project = await ProjectService.getById(req.query.id);
            if (project) {
              values = {
                client_id: project.client_id,
                project_name: project.project_name || "",
                description: project.description || "",
                total_amount: project.total_amount || "",
                job_status: project.job_status || "pending",
              };
            }
          }
          crudForm.values = values;
        } else {
          crudForm.values = req.query.values || {};
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

function getDashboardPermissions(user) {
  if (user.role === "admin") {
    return {
      canCreateClients: true,
      canEditClients: true,
      canDeleteClients: true,
      canCreateProducts: true,
      canEditProducts: true,
      canDeleteProducts: true,
      canCreateOrders: true,
      canEditOrders: true,
      canDeleteOrders: true,
    };
  } else {
    return {
      canCreateClients: false,
      canEditClients: false,
      canDeleteClients: false,
      canCreateProducts: false,
      canEditProducts: false,
      canDeleteProducts: false,
      canCreateOrders: true,
      canEditOrders: true,
      canDeleteOrders: false,
    };
  }
}
