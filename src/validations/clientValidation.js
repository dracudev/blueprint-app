const { body } = require("express-validator");

const clientValidation = {
  validateClientSetup: [
    body("isCompany")
      .notEmpty()
      .withMessage("Client type is required")
      .isIn(["true", "false"])
      .withMessage("Invalid client type"),

    body("companyName")
      .if(body("isCompany").equals("true"))
      .notEmpty()
      .withMessage("Company name is required for business accounts")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Company name must be between 2 and 100 characters")
      .matches(/^[a-zA-Z0-9\s\.\-&']+$/)
      .withMessage("Company name contains invalid characters"),

    body("companyName")
      .if(body("isCompany").equals("false"))
      .optional({ nullable: true, checkFalsy: true }),

    body("firstName")
      .if(body("isCompany").equals("false"))
      .notEmpty()
      .withMessage("First name is required for individual accounts")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage(
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      ),

    body("firstName")
      .if(body("isCompany").equals("true"))
      .optional({ nullable: true, checkFalsy: true }),

    body("lastName")
      .if(body("isCompany").equals("false"))
      .notEmpty()
      .withMessage("Last name is required for individual accounts")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage(
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      ),

    body("lastName")
      .if(body("isCompany").equals("true"))
      .optional({ nullable: true, checkFalsy: true }),

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

  validateClientUpdate: [
    body("isCompany")
      .optional()
      .isIn(["true", "false"])
      .withMessage("Invalid client type"),

    body("companyName")
      .if(body("isCompany").equals("true"))
      .notEmpty()
      .withMessage("Company name is required for business accounts")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Company name must be between 2 and 100 characters")
      .matches(/^[a-zA-Z0-9\s\.\-&']+$/)
      .withMessage("Company name contains invalid characters"),

    body("companyName")
      .if(body("isCompany").equals("false"))
      .optional({ nullable: true, checkFalsy: true }),

    body("firstName")
      .if(body("isCompany").equals("false"))
      .notEmpty()
      .withMessage("First name is required for individual accounts")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage(
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      ),

    body("firstName")
      .if(body("isCompany").equals("true"))
      .optional({ nullable: true, checkFalsy: true }),

    body("lastName")
      .if(body("isCompany").equals("false"))
      .notEmpty()
      .withMessage("Last name is required for individual accounts")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage(
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      ),

    body("lastName")
      .if(body("isCompany").equals("true"))
      .optional({ nullable: true, checkFalsy: true }),

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

const validateAdminClient = [
  ...clientValidation.validateClientSetup,
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .if(body("isEdit").not().equals("true"))
    .trim()
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters (no spaces at start/end)"
    ),
];

const validateAdminClientEdit = [
  ...clientValidation.validateClientUpdate,
  body("email").isEmail().withMessage("Valid email required"),
];

module.exports = {
  ...clientValidation,
  validateAdminClient,
  validateAdminClientEdit,
};
