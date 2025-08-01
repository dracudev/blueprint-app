const { verifyJwt } = require("../utils/jwt");

const jwtAuth = (req, res, next) => {
  const token = req.session && req.session.jwt;
  if (!token) {
    return res.redirect("/auth/login");
  }
  const user = verifyJwt(token);
  if (!user) {
    req.session.destroy(() => {
      res.redirect("/auth/login");
    });
    return;
  }

  // Merge dashboard permissions into req.user
  const sessionUser = req.session.user;
  const permissions = getDashboardPermissions(sessionUser);
  req.user = { ...sessionUser, ...permissions };
  next();
};

// Helper function to get dashboard permissions (moved from dashboardController)
function getDashboardPermissions(user) {
  if (user.role === "admin") {
    return {
      canCreateClients: true,
      canEditClients: true,
      canDeleteClients: true,
      canCreateProducts: true,
      canEditProducts: true,
      canDeleteProducts: true,
      canCreateServices: true,
      canEditServices: true,
      canDeleteServices: true,
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
      canCreateServices: false,
      canEditServices: false,
      canDeleteServices: false,
      canCreateOrders: true,
      canEditOrders: true,
      canDeleteOrders: false,
    };
  }
}

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).render("error", {
      title: "Access Denied",
      message: "You don't have permission to access this page.",
      user: req.session.user,
    });
  }
  next();
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) return next();
    return res.status(403).send("Forbidden");
  };
};

const can = (action) => {
  return (req, res, next) => {
    if (req.user && req.user[`can${capitalize(action)}`]) return next();
    return res.status(403).send("Forbidden");
  };
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};

module.exports = {
  requireAdmin,
  requireRole,
  can,
  redirectIfAuthenticated,
  jwtAuth,
  getDashboardPermissions,
};
