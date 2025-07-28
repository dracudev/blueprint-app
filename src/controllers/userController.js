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

      const user = await models.User.findByPk(userId, {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profile_picture: true,
          created_at: true,
        },
      });

      if (!user) {
        return res.redirect("/auth/login");
      }

      let client = null;
      try {
        client = await models.Client.findOne({
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

  updateProfilePicture: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = req.session.user.id;
      const user = await models.User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (
        user.profile_picture &&
        !user.profile_picture.includes("default-avatar.png")
      ) {
        const oldImagePath = path.join(
          __dirname,
          "../../public",
          user.profile_picture
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const newProfilePicturePath = `/uploads/${req.file.filename}`;
      await user.update({ profile_picture: newProfilePicturePath });

      req.session.user.profile_picture = newProfilePicturePath;

      res.json({
        success: true,
        message: "Profile picture updated successfully",
        profilePicture: newProfilePicturePath,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);

      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../../public/uploads",
          req.file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(500).json({ error: "Failed to update profile picture" });
    }
  },
};

module.exports = userController;
