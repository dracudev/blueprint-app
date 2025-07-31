document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".dashboard-crud-form-container form");
  if (!form) return;
  function toggleFields() {
    const isCompany =
      form.querySelector('input[name="isCompany"]:checked')?.value === "true";
    form.querySelectorAll(".form-group").forEach((group) => {
      if (group.querySelector('[name="companyName"]')) {
        group.style.display = isCompany ? "" : "none";
      }
      if (
        group.querySelector('[name="firstName"]') ||
        group.querySelector('[name="lastName"]')
      ) {
        group.style.display = !isCompany ? "" : "none";
      }
    });
  }
  form.querySelectorAll('input[name="isCompany"]').forEach((radio) => {
    radio.addEventListener("change", toggleFields);
  });
  toggleFields();
});
