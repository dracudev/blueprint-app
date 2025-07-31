document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".dashboard-tab");
  const crudForm = document.querySelector(".dashboard-crud-form-container");
  if (crudForm) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", function (e) {
        e.preventDefault();
        const tabName = tab.getAttribute("data-tab");
        if (tabName) {
          window.location.href = `/dashboard?tab=${tabName}`;
        }
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
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

  const initialTab = document.body.dataset.currentTab || "users";
  activateTab(initialTab);

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const tabName = this.dataset.tab;
      activateTab(tabName);
    });
  });

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
