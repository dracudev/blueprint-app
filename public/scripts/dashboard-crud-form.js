/**
 * Dashboard CRUD Form Handler
 * Handles form submissions via AJAX to REST API endpoints
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".dashboard-crud-form-container form");
  if (!form) return;

  initializeClientTypeToggle();
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
