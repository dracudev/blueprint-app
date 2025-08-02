/**
 * Dashboard CRUD Form Handler
 * Handles form submissions via AJAX to REST API endpoints
 */
document.addEventListener("DOMContentLoaded", function () {
  const form =
    document.querySelector(".dashboard-crud-form-container .crud-form") ||
    document.querySelector(".crud-form");

  if (!form) {
    console.log("No CRUD form found on this page");
    return;
  }

  console.log("CRUD form found, initializing...");

  initializeClientTypeToggle();
  initializeServiceSelector();
  initializeFormSubmission();

  /**
   * Initialize client type toggle functionality (company vs individual)
   */
  function initializeClientTypeToggle() {
    function toggleFields() {
      const isCompanyRadio = form.querySelector(
        'input[name="isCompany"]:checked'
      );
      const isCompany = isCompanyRadio
        ? isCompanyRadio.value === "true"
        : false;

      const companyNameGroup = form
        .querySelector('[name="companyName"]')
        ?.closest(".form-group");
      const firstNameGroup = form
        .querySelector('[name="firstName"]')
        ?.closest(".form-group");
      const lastNameGroup = form
        .querySelector('[name="lastName"]')
        ?.closest(".form-group");

      if (companyNameGroup) {
        companyNameGroup.style.display = isCompany ? "" : "none";
      }
      if (firstNameGroup) {
        firstNameGroup.style.display = !isCompany ? "" : "none";
      }
      if (lastNameGroup) {
        lastNameGroup.style.display = !isCompany ? "" : "none";
      }

      const companyNameInput = form.querySelector('[name="companyName"]');
      const firstNameInput = form.querySelector('[name="firstName"]');
      const lastNameInput = form.querySelector('[name="lastName"]');

      if (isCompany) {
        if (companyNameInput)
          companyNameInput.setAttribute("required", "required");
        if (firstNameInput) firstNameInput.removeAttribute("required");
        if (lastNameInput) lastNameInput.removeAttribute("required");
      } else {
        if (companyNameInput) companyNameInput.removeAttribute("required");
        if (firstNameInput) firstNameInput.setAttribute("required", "required");
        if (lastNameInput) lastNameInput.setAttribute("required", "required");
      }
    }

    form.querySelectorAll('input[name="isCompany"]').forEach((radio) => {
      radio.addEventListener("change", toggleFields);
    });

    toggleFields();
  }

  /**
   * Initialize service selector functionality (for project forms)
   */
  function initializeServiceSelector() {
    const serviceContainer = form.querySelector(
      '[data-field-type="service-selector"]'
    );
    if (!serviceContainer) {
      console.log("No service selector found in form");
      return;
    }

    console.log("Service selector found, initializing...");

    let servicesData = [];
    let existingServices = [];

    try {
      servicesData = JSON.parse(serviceContainer.dataset.services || "[]");
    } catch (e) {
      console.error("Error parsing services data:", e);
      servicesData = [];
    }

    try {
      existingServices = JSON.parse(
        serviceContainer.dataset.existingServices || "[]"
      );
    } catch (e) {
      console.error("Error parsing existing services data:", e);
      existingServices = [];
    }

    console.log("Services data:", servicesData);
    console.log("Existing services:", existingServices);

    if (!servicesData || servicesData.length === 0) {
      console.warn("No services data available for service selector");
      serviceContainer.innerHTML = `
        <div class="alert alert-warning">
          <p>No services available. Please add services first before creating projects.</p>
        </div>
      `;
      return;
    }

    let selectedServices = [...existingServices];

    // Create the service selector UI
    createServiceSelectorUI(serviceContainer, servicesData, selectedServices);
  }

  /**
   * Create service selector UI
   */
  function createServiceSelectorUI(
    container,
    availableServices,
    selectedServices
  ) {
    console.log("Creating service selector UI with:", {
      availableServices,
      selectedServices,
    });

    container.innerHTML = `
      <div class="service-selector">
        <div class="service-selector-header">
          <label class="form-label">Project Services</label>
          <button type="button" class="btn btn-sm btn-secondary add-service-btn">Add Service</button>
        </div>
        <div class="selected-services-list"></div>
        <input type="hidden" name="services" class="services-input" />
      </div>
    `;

    const servicesList = container.querySelector(".selected-services-list");
    const servicesInput = container.querySelector(".services-input");
    const addServiceBtn = container.querySelector(".add-service-btn");

    if (!servicesList || !servicesInput || !addServiceBtn) {
      console.error("Failed to create service selector elements");
      return;
    }

    // Render existing services
    updateServicesList();

    // Add service button handler
    addServiceBtn.addEventListener("click", () => {
      const availableService = availableServices.find(
        (s) => !selectedServices.some((sel) => sel.serviceId === s.serviceId)
      );

      if (availableService) {
        selectedServices.push({
          serviceId: availableService.serviceId,
          service_name: availableService.serviceName,
          quantity: 1,
          unitPrice: availableService.price,
        });
        updateServicesList();
      } else {
        alert("No more services available to add.");
      }
    });

    function updateServicesList() {
      try {
        // Update hidden input
        servicesInput.value = JSON.stringify(selectedServices);

        // Render service items
        if (selectedServices.length === 0) {
          servicesList.innerHTML = `
            <div class="no-services-message" style="text-align: center; padding: var(--space-4); color: var(--text-muted);">
              <p>No services added yet. Click "Add Service" to get started.</p>
            </div>
          `;
          return;
        }

        servicesList.innerHTML = selectedServices
          .map(
            (service, index) => `
          <div class="service-item" data-index="${index}">
            <div class="service-item-content">
              <div class="service-info">
                <select class="form-control service-select" data-index="${index}">
                  ${availableServices
                    .map(
                      (s) => `
                    <option value="${s.serviceId}" ${
                        s.serviceId == service.serviceId ? "selected" : ""
                      }>
                      ${s.serviceName} - ${s.price}€
                    </option>
                  `
                    )
                    .join("")}
                </select>
              </div>
              <div class="service-quantity">
                <label>Qty:</label>
                <input type="number" class="form-control quantity-input" 
                       value="${
                         service.quantity
                       }" min="1" data-index="${index}" />
              </div>
              <div class="service-price">
                <label>Unit Price:</label>
                <input type="number" class="form-control price-input" 
                       value="${
                         service.unitPrice
                       }" min="0" step="0.01" data-index="${index}" />
              </div>
              <div class="service-total">
                ${(service.quantity * service.unitPrice).toFixed(2)}€
              </div>
              <button type="button" class="btn btn-sm btn-danger remove-service-btn" data-index="${index}">
                Remove
              </button>
            </div>
          </div>
        `
          )
          .join("");

        // Add event listeners
        servicesList.querySelectorAll(".service-select").forEach((select) => {
          select.addEventListener("change", handleServiceChange);
        });

        servicesList.querySelectorAll(".quantity-input").forEach((input) => {
          input.addEventListener("change", handleQuantityChange);
        });

        servicesList.querySelectorAll(".price-input").forEach((input) => {
          input.addEventListener("change", handlePriceChange);
        });

        servicesList.querySelectorAll(".remove-service-btn").forEach((btn) => {
          btn.addEventListener("click", handleRemoveService);
        });
      } catch (error) {
        console.error("Error updating services list:", error);
        servicesList.innerHTML = `
          <div class="alert alert-danger">
            <p>Error updating services list. Please try again.</p>
          </div>
        `;
      }
    }

    function handleServiceChange(e) {
      const index = parseInt(e.target.dataset.index);
      const serviceId = parseInt(e.target.value);
      const service = availableServices.find((s) => s.serviceId === serviceId);

      if (service) {
        selectedServices[index] = {
          ...selectedServices[index],
          serviceId: service.serviceId,
          service_name: service.serviceName,
          unitPrice: service.price,
        };
        updateServicesList();
      }
    }

    function handleQuantityChange(e) {
      const index = parseInt(e.target.dataset.index);
      selectedServices[index].quantity = parseInt(e.target.value) || 1;
      updateServicesList();
    }

    function handlePriceChange(e) {
      const index = parseInt(e.target.dataset.index);
      selectedServices[index].unitPrice = parseFloat(e.target.value) || 0;
      updateServicesList();
    }

    function handleRemoveService(e) {
      const index = parseInt(e.target.dataset.index);
      selectedServices.splice(index, 1);
      updateServicesList();
    }
  }

  /**
   * Initialize form submission handling
   */
  function initializeFormSubmission() {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      try {
        submitButton.disabled = true;
        submitButton.textContent = "Saving...";

        clearValidationErrors();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        cleanupClientFormData(data);

        const entityInfo = getEntityInfo(form, data);

        if (!entityInfo) {
          throw new Error("Unable to determine entity type");
        }

        const result = await performApiRequest(entityInfo, data);

        window.notificationService.success(
          `${entityInfo.entity} ${
            entityInfo.isEdit ? "updated" : "created"
          } successfully!`
        );

        const tab = getTabForEntity(entityInfo.entity);
        window.location.href = `/dashboard?tab=${tab}&success=1`;
      } catch (error) {
        console.error("Form submission error:", error);

        if (
          error.isValidationError &&
          error.errors &&
          error.errors.length > 0
        ) {
          displayValidationErrors(error.errors);
        } else {
          window.notificationService.error(
            error.message || "An error occurred while saving. Please try again."
          );
        }
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }

  /**
   * Clean up client form data based on account type
   */
  function cleanupClientFormData(data) {
    const isCompanyRadio = form.querySelector(
      'input[name="isCompany"]:checked'
    );
    const isCompany = isCompanyRadio ? isCompanyRadio.value === "true" : false;

    if (isCompany) {
      data.firstName = "";
      data.lastName = "";
    } else {
      data.companyName = "";
    }
  }

  /**
   * Determine entity type and whether it's an edit operation
   */
  function getEntityInfo(form, data) {
    const entityType = form.dataset.entityType;
    const isEdit = form.dataset.isEdit === "true";

    if (entityType) {
      let id = null;
      if (isEdit) {
        id =
          form.dataset.clientId ||
          form.dataset.serviceId ||
          form.dataset.projectId ||
          form.dataset.entityId;
      }

      return {
        entity: entityType,
        isEdit: isEdit,
        id: id,
      };
    }

    const clientId =
      form.querySelector('[name="clientId"]')?.value || form.dataset.clientId;
    const serviceId =
      form.querySelector('[name="serviceId"]')?.value || form.dataset.serviceId;
    const projectId =
      form.querySelector('[name="projectId"]')?.value || form.dataset.projectId;

    if (clientId || data.email || data.isCompany !== undefined) {
      return {
        entity: "client",
        isEdit: !!clientId,
        id: clientId,
      };
    } else if (serviceId || data.service_name) {
      return {
        entity: "service",
        isEdit: !!serviceId,
        id: serviceId,
      };
    } else if (projectId || data.client_id || data.project_name) {
      return {
        entity: "project",
        isEdit: !!projectId,
        id: projectId,
      };
    }

    return null;
  }

  /**
   * Perform the appropriate API request
   */
  async function performApiRequest(entityInfo, data) {
    const { entity, isEdit, id } = entityInfo;

    if (!window.apiService) {
      throw new Error("API service not available");
    }

    if (isEdit && id) {
      switch (entity) {
        case "client":
          return await window.apiService.updateClient(id, data);
        case "service":
          return await window.apiService.updateService(id, data);
        case "project":
          return await window.apiService.updateProject(id, data);
        default:
          throw new Error(`Unknown entity type: ${entity}`);
      }
    } else {
      switch (entity) {
        case "client":
          return await window.apiService.createClient(data);
        case "service":
          return await window.apiService.createService(data);
        case "project":
          return await window.apiService.createProject(data);
        default:
          throw new Error(`Unknown entity type: ${entity}`);
      }
    }
  }

  /**
   * Display validation errors on the form
   */
  function displayValidationErrors(errors) {
    clearValidationErrors();

    let errorContainer = form.querySelector(".validation-errors");
    if (!errorContainer) {
      errorContainer = document.createElement("div");
      errorContainer.className = "validation-errors alert alert-danger";
      errorContainer.style.marginBottom = "20px";
      form.insertBefore(errorContainer, form.firstElementChild);
    }

    const errorList = document.createElement("ul");
    errorList.style.marginBottom = "0";

    errors.forEach((error) => {
      const errorItem = document.createElement("li");
      errorItem.textContent = error.msg || error.message || error;
      errorList.appendChild(errorItem);
    });

    errorContainer.innerHTML = "";
    if (errors.length === 1) {
      errorContainer.textContent =
        errors[0].msg || errors[0].message || errors[0];
    } else {
      errorContainer.appendChild(errorList);
    }

    errorContainer.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /**
   * Clear validation errors
   */
  function clearValidationErrors() {
    const errorContainer = form.querySelector(".validation-errors");
    if (errorContainer) {
      errorContainer.remove();
    }
  }

  /**
   * Get the appropriate tab name for the entity
   */
  function getTabForEntity(entity) {
    const tabMap = {
      client: "clients",
      service: "services",
      project: "projects",
    };
    return tabMap[entity] || "clients";
  }
});
