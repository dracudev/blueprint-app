// dashboard.js
// Handles tab navigation and CRUD button interactivity for the dashboard
// This script assumes the presence of .dashboard-tab and .dashboard-section elements

document.addEventListener("DOMContentLoaded", function () {
  // Tab switching logic
  const tabs = document.querySelectorAll(".dashboard-tab");
  const sections = document.querySelectorAll(".dashboard-section");

  function activateTab(tabName) {
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
  }

  // Initial tab (from server or default)
  const initialTab = document.body.dataset.currentTab || "users";
  activateTab(initialTab);

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const tabName = this.dataset.tab;
      activateTab(tabName);
      // Optionally update URL or history here
    });
  });

  // CRUD button interactivity (demo only)
  document.querySelectorAll(".crud-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const action = this.dataset.action;
      const entity = this.dataset.entity;
      const id = this.dataset.id;
      if (action === "delete") {
        if (confirm(`Are you sure you want to delete this ${entity}?`)) {
          console.log(`Delete ${entity} with ID: ${id}`);
        }
      } else {
        console.log(`${action} ${entity}${id ? " with ID: " + id : ""}`);
      }
    });
  });
});
