/**
 * Dashboard Main Controller
 * Handles tab navigation and CRUD operations via AJAX
 */
document.addEventListener("DOMContentLoaded", function () {
  initializeTabs();
  initializeCrudButtons();
  initializeDeleteOperations();
});

/**
 * Initialize tab navigation
 */
function initializeTabs() {
  const tabs = document.querySelectorAll(".dashboard-tab");
  const sections = document.querySelectorAll(".dashboard-section");

  function activateTab(tabName, isUserClick = false) {
    const crudFormContainer = document.querySelector(
      ".dashboard-crud-form-container"
    );
    if (crudFormContainer && isUserClick) {
      window.location.href = `/dashboard?tab=${tabName}`;
      return;
    }

    tabs.forEach((tab) => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    sections.forEach((section) => {
      if (section.dataset.tab === tabName) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });

    updateDocumentTitle(tabName);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const mainElement = document.querySelector("main");
  const initialTab =
    urlParams.get("tab") ||
    (mainElement && mainElement.dataset.currentTab) ||
    "clients";
  activateTab(initialTab);

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const tabName = this.dataset.tab;
      activateTab(tabName, true);

      const newUrl = new URL(window.location);
      newUrl.searchParams.set("tab", tabName);
      window.history.pushState({}, "", newUrl);
    });
  });
}

/**
 * Update document title based on current tab and user role
 */
function updateDocumentTitle(tabName) {
  const userRole = getUserRole();

  let title = "Dashboard";

  if (tabName === "clients") {
    title = userRole === "admin" ? "Manage Clients" : "My Profile";
  } else if (tabName === "services") {
    title = userRole === "admin" ? "Manage Services" : "Available Services";
  } else if (tabName === "projects") {
    title = userRole === "admin" ? "Manage Projects" : "My Projects";
  }

  document.title = `CodeCost | ${title}`;
}

/**
 * Get user role from the page context
 */
function getUserRole() {
  const mainElement = document.querySelector("main");
  if (mainElement && mainElement.dataset.userRole) {
    return mainElement.dataset.userRole;
  }

  const adminTabs = document.querySelectorAll(
    '.dashboard-tab[data-tab="clients"], .dashboard-tab[data-tab="services"]'
  );
  return adminTabs.length > 1 ? "admin" : "client";
}

/**
 * Initialize CRUD buttons (Create, Edit)
 */
function initializeCrudButtons() {
  document.querySelectorAll(".crud-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      const action = this.dataset.action;
      const entity = this.dataset.entity;
      const id = this.dataset.id;

      if (action === "create" || action === "edit") {
        let url = `/dashboard?action=${action}&entity=${entity}`;
        if (id) {
          url += `&id=${id}`;
        }

        const currentTab = getCurrentTab();
        if (currentTab) {
          url += `&tab=${currentTab}`;
        }

        window.location.href = url;
      }
    });
  });
}

/**
 * Initialize delete operations with AJAX
 */
function initializeDeleteOperations() {
  document
    .querySelectorAll('.crud-btn[data-action="delete"]')
    .forEach((btn) => {
      btn.addEventListener("click", async function (e) {
        e.preventDefault();

        const entity = this.dataset.entity;
        const id = this.dataset.id;
        const entityName = getEntityDisplayName(entity);

        if (!confirm(`Are you sure you want to delete this ${entityName}?`)) {
          return;
        }

        try {
          const originalText = this.textContent;
          this.disabled = true;
          this.textContent = "Deleting...";

          await performDeleteOperation(entity, id);

          window.notificationService.success(
            `${entityName} deleted successfully!`
          );

          const currentTab = getCurrentTab();
          setTimeout(() => {
            window.location.href = `/dashboard?tab=${currentTab}&success=1`;
          }, 1000);
        } catch (error) {
          console.error("Delete operation failed:", error);
          window.notificationService.error(
            error.message || `Failed to delete ${entityName}. Please try again.`
          );

          this.disabled = false;
          this.textContent = originalText;
        }
      });
    });
}

/**
 * Perform delete operation via API
 */
async function performDeleteOperation(entity, id) {
  if (!window.apiService) {
    throw new Error("API service not available");
  }

  switch (entity) {
    case "client":
      return await window.apiService.deleteClient(id);
    case "service":
      return await window.apiService.deleteService(id);
    case "project":
      return await window.apiService.deleteProject(id);
    default:
      throw new Error(`Unknown entity type: ${entity}`);
  }
}

/**
 * Get display name for entity
 */
function getEntityDisplayName(entity) {
  const displayNames = {
    client: "Client",
    service: "Service",
    project: "Project",
  };
  return displayNames[entity] || entity;
}

/**
 * Get current active tab
 */
function getCurrentTab() {
  const activeTab = document.querySelector(".dashboard-tab.active");
  return activeTab ? activeTab.dataset.tab : "clients";
}

/**
 * Show loading state for any element
 */
function showLoadingState(element, originalText) {
  element.disabled = true;
  element.textContent = "Loading...";
  return () => {
    element.disabled = false;
    element.textContent = originalText;
  };
}

/**
 * Handle success messages from URL parameters
 */
function handleSuccessMessages() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("success")) {
    window.notificationService.success("Operation completed successfully!");

    const newUrl = new URL(window.location);
    newUrl.searchParams.delete("success");
    window.history.replaceState({}, "", newUrl);
  }
}

document.addEventListener("DOMContentLoaded", handleSuccessMessages);
