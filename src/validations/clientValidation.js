const { body } = require("express-validator");

const clientValidation = {
  validateClientSetup: [
    body("isCompany")
      .notEmpty()
      .withMessage("Client type is required")
      .isIn(["true", "false"])
      .withMessage("Invalid client type"),

    body("companyName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Company name must be between 2 and 100 characters")
      .matches(/^[a-zA-Z0-9\s\.\-&']+$/)
      .withMessage("Company name contains invalid characters"),

    body("firstName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage(
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      ),

    body("lastName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage(
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      ),

    body("phone")
      .optional({ nullable: true, checkFalsy: true })
      .isMobilePhone("any", { strictMode: false })
      .withMessage("Please enter a valid phone number"),

    body("billingAddress")
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ max: 500 })
      .withMessage("Billing address cannot exceed 500 characters"),

    body().custom((value, { req }) => {
      const { isCompany, companyName, firstName, lastName } = req.body;

      if (isCompany === "true") {
        if (!companyName || companyName.trim().length === 0) {
          throw new Error("Company name is required for business accounts");
        }
      } else {
        if (!firstName || firstName.trim().length === 0) {
          throw new Error("First name is required for individual accounts");
        }
        if (!lastName || lastName.trim().length === 0) {
          throw new Error("Last name is required for individual accounts");
        }
      }

      return true;
    }),
  ],

  validateClientUpdate: [
    body("isCompany")
      .optional()
      .isIn(["true", "false"])
      .withMessage("Invalid client type"),

    body("companyName")
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Company name must be between 2 and 100 characters")
      .matches(/^[a-zA-Z0-9\s\.\-&']+$/)
      .withMessage("Company name contains invalid characters"),

    body("firstName")
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage(
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      ),

    body("lastName")
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage(
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      ),

    body("phone")
      .optional({ nullable: true, checkFalsy: true })
      .isMobilePhone("any", { strictMode: false })
      .withMessage("Please enter a valid phone number"),

    body("billingAddress")
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ max: 500 })
      .withMessage("Billing address cannot exceed 500 characters"),
  ],
};

module.exports = clientValidation;
