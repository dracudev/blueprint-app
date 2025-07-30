const ClientService = require("../services/ClientService");
const ServiceService = require("../services/ServiceService");
const ProjectService = require("../services/ProjectService");

module.exports = {
  async renderDashboard(req, res) {
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
    res.render("dashboard", {
      title,
      user: { ...user, ...permissions },
      clients,
      services,
      projects,
      currentTab: tab,
    });
  },
};

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
