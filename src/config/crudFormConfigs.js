const crudFormConfigs = {
  client: {
    fields: [
      {
        name: "isCompany",
        label: "Account Type",
        type: "select",
        required: true,
        options: [
          { value: "false", label: "Individual" },
          { value: "true", label: "Company" },
        ],
      },
      {
        name: "companyName",
        label: "Company Name",
        type: "text",
        required: false,
        help: "Required if account type is Company",
      },
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        required: false,
        help: "Required if account type is Individual",
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        required: false,
        help: "Required if account type is Individual",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        readonly: true,
      },
      { name: "phone", label: "Phone", type: "text", required: false },
      {
        name: "billingAddress",
        label: "Billing Address",
        type: "textarea",
        required: false,
      },
    ],
    action: "/client/setup",
    method: "POST",
    submitLabel: "Save",
  },
  service: {
    fields: [
      {
        name: "service_name",
        label: "Service Name",
        type: "text",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        pattern: "^\\d+(\\.\\d{1,2})?$",
      },
    ],
    action: "/api/services",
    method: "POST",
    submitLabel: "Save",
  },
  project: {
    fields: [
      {
        name: "client_id",
        label: "Client",
        type: "select",
        required: true,
        options: [],
      },
      {
        name: "project_name",
        label: "Project Name",
        type: "text",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
      },
      {
        name: "total_amount",
        label: "Total Amount",
        type: "number",
        required: true,
        pattern: "^\\d+(\\.\\d{1,2})?$",
      },
      {
        name: "job_status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "pending", label: "Pending" },
          { value: "active", label: "Active" },
          { value: "completed", label: "Completed" },
        ],
      },
    ],
    action: "/api/projects",
    method: "POST",
    submitLabel: "Save",
  },
};

module.exports = crudFormConfigs;
