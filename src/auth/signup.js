import { state } from "../consts.js";
import { removeError, showError } from "../utils/errors.js";
import { fetchAjax } from "../utils/fetchAjax.js";
import { goToPage } from "../index.js";
import { addItemLocalStorage } from "../utils/storages.js";

/**
 * Функция валидации регистрационной формы
 * @param {*} form Форма регистрации
 * @param {*} inputUsername Поле ввода логина
 * @param {*} inputPassword Поле ввода пароля
 * @param {*} inputRepeatPassword Поле ввода повторного пароля
 * @returns true, если форма содержит ошибки, false - если форма корректна
 */
export function validateSignupForm(
  form,
  inputUsername,
  inputPassword,
  inputRepeatPassword,
) {
  var errors = form.querySelectorAll(".error");
  let passwordErrors = [];

  for (var i = 0; i < errors.length; i++) {
    errors[i].remove();
  }

  let hasError = false;
  let firstLoginError = false;
  let firstPasswordError = false;

  if (!DOMPurify.sanitize(inputUsername.value)) {
    showError(inputUsername, "Пожалуйста, введите логин");
    hasError = true;
    firstLoginError = true;
  } else {
    removeError(inputUsername);
  }

  if (!DOMPurify.sanitize(inputPassword.value)) {
    showError(inputPassword, "Пожалуйста, введите пароль");
    hasError = true;
    firstPasswordError = true;
  } else {
    removeError(inputPassword);
  }

  if (
    DOMPurify.sanitize(inputRepeatPassword.value) !=
    DOMPurify.sanitize(inputPassword.value)
  ) {
    showError(inputRepeatPassword, "Пароли должны совпадать");
    hasError = true;
  } else {
    removeError(inputRepeatPassword);
  }

  if (
    !/^(?=.*[a-zA-Z])[a-zA-Z0-9-_]+$/.test(
      DOMPurify.sanitize(inputUsername.value),
    ) &&
    !firstLoginError
  ) {
    showError(
      inputUsername,
      'Логин должен содержать хотя бы одну латинскую букву, и может содержать цифры и знаки "-" "_"',
    );
    hasError = true;
  } else {
    removeError(inputUsername);
  }
  if (
    (DOMPurify.sanitize(inputUsername.value).length < 4 ||
      DOMPurify.sanitize(inputUsername.value).length > 10) &&
    !firstLoginError
  ) {
    showError(
      inputUsername,
      "Логин должен быть не менее 4 и не более 10 символов",
    );
    hasError = true;
  } else {
    removeError(inputUsername);
  }

  if (
    DOMPurify.sanitize(inputPassword.value).length < 8 ||
    DOMPurify.sanitize(inputPassword.value).length > 64
  ) {
    passwordErrors.push("Пароль должен быть не менее 8 и не более 64 символов");
  }

  if (!/[0-9]/.test(DOMPurify.sanitize(inputPassword.value))) {
    passwordErrors.push("Пароль должен содержать хотя бы одну цифру");
  }
  if (!/[!@#$%^&*]/.test(DOMPurify.sanitize(inputPassword.value))) {
    passwordErrors.push("Пароль должен содержать хотя бы один спецсимвол");
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])/.test(DOMPurify.sanitize(inputPassword.value))) {
    passwordErrors.push(
      "Пароль должен содержать хотя бы одну латинскую букву в нижнем регистре и одну в верхнем регистре",
    );
  }

  if (passwordErrors.length > 0 && !firstPasswordError) {
    showError(inputPassword, passwordErrors.join("<br>"));
    hasError = true;
  } else {
    removeError(inputPassword);
  }

  return hasError;
}
/**
 * Выводит ошибку регистрации, если пользователь уже существует.
 * @param {*} inputLogin Поле ввода логина
 * @param {*} inputPassword Поле ввода пароля
 * @param {*} inputRepeatPassword Поле ввода повторного пароля
 */
function validationErrorSignupForm(
  inputLogin,
  inputPassword,
  inputRepeatPassword,
) {
  showError(inputLogin, "");
  showError(inputPassword, "");
  showError(inputRepeatPassword, `Пользователь уже существует`);
}

/**
 * Регистрирует нового пользователя, если форма регистрации корректна.
 * @param {*} form Форма регистрации
 * @param {*} username Поле ввода логина
 * @param {*} password Поле ввода пароля
 * @param {*} inputRepeatPassword Поле ввода повторного пароля
 */
export function authSignup(form, username, password, inputRepeatPassword) {
  if (!validateSignupForm(form, username, password, inputRepeatPassword)) {
    fetchAjax(
      "POST",
      "/api/auth/register",
      { username: username.value, password: password.value },
      (response) => {
        if (response.ok) {
          addItemLocalStorage(DOMPurify.sanitize(username.value));
          goToPage(state.menuElements.profile);
        } else if (response.status === 400) {
          validationErrorSignupForm(username, password, inputRepeatPassword);
        }
      },
    );
  }
}
