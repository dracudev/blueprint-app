const { body } = require("express-validator");

const serviceValidation = {
  validateService: [
    body("service_name")
      .notEmpty()
      .withMessage("Service name is required")
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage("Service name must be between 2 and 255 characters")
      .matches(/^[a-zA-Z0-9\s\.\-&']+$/)
      .withMessage("Service name contains invalid characters"),

    body("description")
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description must not exceed 1000 characters"),

    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
  ],
};

module.exports = serviceValidation;
