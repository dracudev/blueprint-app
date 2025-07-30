const { verifyJwt, signJwt } = require("../utils/jwt");

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

  // Sync session user with JWT user
  req.session.user = user;

  // Refresh JWT while session is valid
  const newToken = signJwt({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  req.session.jwt = newToken;
  req.user = user;
  next();
};

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
};
