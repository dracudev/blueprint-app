const { body } = require("express-validator");

const projectValidation = {
  validateProject: [
    body("client_id")
      .notEmpty()
      .withMessage("Client is required")
      .isInt({ min: 1 })
      .withMessage("Invalid client selected"),

    body("job_status")
      .optional()
      .isIn(["RECEIVED", "IN_PROGRESS", "COMPLETED", "DELIVERED"])
      .withMessage("Invalid job status"),

    body("total_amount")
      .optional({ nullable: true, checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage("Total amount must be a positive number"),
  ],
};

module.exports = projectValidation;
