const topButton = document.querySelector("#topButton");
const registrationForm = document.querySelector("#registrationForm");
const formStatus = document.querySelector("#formStatus");
const rewardNote = document.querySelector("#rewardNote");
const birthDateInput = document.querySelector("#birthDate");

topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

const minimumBirthDate = new Date();
minimumBirthDate.setFullYear(minimumBirthDate.getFullYear() - 13);
birthDateInput.max = minimumBirthDate.toISOString().split("T")[0];

const validators = {
  fullName: (value) => value.trim() ? "" : "Ingresa tu nombre completo.",
  username: (value) => value.trim() ? "" : "Ingresa un nombre de usuario.",
  email: (value) => {
    if (!value.trim()) return "Ingresa tu correo electronico.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "El correo debe tener formato valido.";
  },
  birthDate: (value) => {
    if (!value) return "Ingresa tu fecha de nacimiento.";

    const today = new Date();
    const birthDate = new Date(`${value}T00:00:00`);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return age >= 13 ? "" : "Debes tener al menos 13 anos para registrarte.";
  },
  password: (value) => {
    if (!value) return "Ingresa una clave.";
    if (value.length < 6 || value.length > 18) return "La clave debe tener entre 6 y 18 caracteres.";
    if (!/[A-Z]/.test(value)) return "La clave debe incluir una letra mayuscula.";
    if (!/\d/.test(value)) return "La clave debe incluir al menos un numero.";
    return "";
  },
  confirmPassword: (value) => {
    const password = registrationForm.password.value;

    if (!value) return "Repite tu clave.";
    return value === password ? "" : "Las claves deben ser iguales.";
  },
  address: () => ""
};

function updateField(field, message) {
  const messageElement = registrationForm.querySelector(`[data-error-for="${field.name}"]`);

  field.classList.toggle("is-invalid", Boolean(message));
  field.classList.toggle("is-valid", !message && Boolean(field.value.trim()));
  messageElement.textContent = message || (field.name === "address" ? "" : "Campo valido.");
  messageElement.classList.toggle("valid", !message && field.name !== "address" && Boolean(field.value.trim()));
}

function validateField(field) {
  const message = validators[field.name](field.value);
  updateField(field, message);
  return !message;
}

function validateForm() {
  const fields = Array.from(registrationForm.elements).filter((element) => element.name);
  let isValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

registrationForm.addEventListener("input", (event) => {
  if (!event.target.name) return;

  validateField(event.target);

  if (event.target.name === "password" && registrationForm.confirmPassword.value) {
    validateField(registrationForm.confirmPassword);
  }

  const completeRequiredFields = ["fullName", "username", "email", "birthDate", "password", "confirmPassword"]
    .every((fieldName) => registrationForm[fieldName].value.trim());

  rewardNote.classList.toggle("ready", completeRequiredFields);
  rewardNote.textContent = completeRequiredFields
    ? "Listo: tus datos principales estan completos."
    : "Beneficio activo: registro con direccion opcional.";
});

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (validateForm()) {
    formStatus.textContent = "Registro enviado correctamente. Ya puedes comenzar a sumar recompensas.";
    formStatus.className = "form-status success";
    registrationForm.classList.add("was-validated");
    return;
  }

  formStatus.textContent = "Revisa los campos marcados antes de enviar el registro.";
  formStatus.className = "form-status error";
});

registrationForm.addEventListener("reset", () => {
  setTimeout(() => {
    registrationForm.querySelectorAll(".form-control").forEach((field) => {
      field.classList.remove("is-valid", "is-invalid");
    });
    registrationForm.querySelectorAll(".field-message").forEach((message) => {
      message.textContent = "";
      message.classList.remove("valid");
    });
    registrationForm.classList.remove("was-validated");
    formStatus.textContent = "Completa el formulario para activar tu registro.";
    formStatus.className = "form-status";
    rewardNote.textContent = "Beneficio activo: registro con direccion opcional.";
    rewardNote.classList.remove("ready");
  }, 0);
});
