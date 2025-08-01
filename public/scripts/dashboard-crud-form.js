document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".dashboard-crud-form-container form");
  if (!form) return;

  function toggleFields() {
    const isCompanyRadio = form.querySelector(
      'input[name="isCompany"]:checked'
    );
    const isCompany = isCompanyRadio ? isCompanyRadio.value === "true" : false;

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

  form.addEventListener("submit", function (e) {
    const isCompanyRadio = form.querySelector(
      'input[name="isCompany"]:checked'
    );
    const isCompany = isCompanyRadio ? isCompanyRadio.value === "true" : false;

    const companyNameInput = form.querySelector('[name="companyName"]');
    const firstNameInput = form.querySelector('[name="firstName"]');
    const lastNameInput = form.querySelector('[name="lastName"]');

    if (isCompany) {
      if (firstNameInput) firstNameInput.value = "";
      if (lastNameInput) lastNameInput.value = "";
    } else {
      if (companyNameInput) companyNameInput.value = "";
    }
  });
});
