import { state, maxAttempts } from "../consts.js";
import { removeError, showError } from "../utils/errors.js";
import { fetchAjax } from "../utils/fetchAjax.js";
import { goToPage } from "../index.js";
import { attempts } from "./loginView.js";

export function validateLoginForm(form, inputLogin, inputPassword) {
  const errors = form.querySelectorAll(".error");
  for (let i = 0; i < errors.length; i++) {
    errors[i].remove();
  }

  let hasError = false;

  if (!DOMPurify.sanitize(inputLogin.value).trim()) {
    showError(inputLogin, "Пожалуйста, введите логин");
    hasError = true;
  } else {
    removeError(inputLogin);
  }

  if (!DOMPurify.sanitize(inputPassword.value)) {
    showError(inputPassword, "Пожалуйста, введите пароль");
    hasError = true;
  } else {
    removeError(inputPassword);
  }

  return hasError;
}
function validateErrorLoginForm(inputLogin, inputPassword) {
  showError(inputLogin, "");
  showError(
    inputPassword,
    `Неправильный логин или пароль, осталось попыток: ${maxAttempts - attempts}`,
  );
  if (checkAttempts(attempts)) {
    goToPage(state.menuElements.home);
  }
}
export function authLogin(form, inputLogin, inputPassword) {
  if (!validateLoginForm(form, inputLogin, inputPassword)) {
    fetchAjax(
      "POST",
      "/api/auth/login",
      { username: inputLogin.value, password: inputPassword.value },
      (response) => {
        if (response.ok) {
          localStorage.setItem("login", DOMPurify.sanitize(inputLogin.value));
          sessionStorage.setItem("login", DOMPurify.sanitize(inputLogin.value));
          goToPage(state.menuElements.profile);
        } else if (response.status === 400) {
          validateErrorLoginForm(inputLogin, inputPassword);
        }
      },
    );
  }
}

function checkAttempts(attempts) {
  if (attempts < maxAttempts) {
    return false;
  } else {
    return true;
  }
}
