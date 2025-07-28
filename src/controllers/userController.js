const models = require("../models");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

const userController = {
  showProfile: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/auth/login");
      }

      const userId = req.session.user.id;

      const user = await models.User.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.redirect("/auth/login");
      }

      let client = null;
      try {
        client = await models.Client.findFirst({
          where: { email: req.session.user.email },
        });
      } catch (clientError) {
        console.log("Client profile not found or error:", clientError.message);
      }

      const successMessage = req.session.successMessage;
      delete req.session.successMessage;

      res.render("profile", {
        title: "My Profile",
        user: user,
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
};

module.exports = userController;
