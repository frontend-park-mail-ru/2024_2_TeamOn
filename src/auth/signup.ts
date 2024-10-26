import {
  REGEXP,
  validatePassword,
  validateUsername,
  RouterLinks,
} from "../consts";
import { removeError, showError } from "../utils/errors";
import { fetchAjax } from "../utils/fetchAjax";
import { addItemLocalStorage } from "../utils/storages";
import * as DOMPurify from "dompurify";
import { route } from "../utils/routing";

/**
 * Функция валидации регистрационной формы
 * @param {*} form Форма регистрации
 * @param {*} inputUsername Поле ввода логина
 * @param {*} inputPassword Поле ввода пароля
 * @param {*} inputRepeatPassword Поле ввода повторного пароля
 * @returns true, если форма содержит ошибки, false - если форма корректна
 */
export function validateSignupForm(
  form: any,
  inputUsername: any,
  inputPassword: any,
  inputRepeatPassword: any,
) {
  var errors = form.querySelectorAll(".error");
  let passwordErrors = [] as string[];

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

  if (!inputPassword.value) {
    showError(inputPassword, "Пожалуйста, введите пароль");
    hasError = true;
    firstPasswordError = true;
  } else {
    removeError(inputPassword);
  }

  if (inputRepeatPassword.value != inputPassword.value) {
    showError(inputRepeatPassword, "Пароли должны совпадать");
    hasError = true;
  } else {
    removeError(inputRepeatPassword);
  }

  if (
    !REGEXP.REGEXP_LOGIN.test(DOMPurify.sanitize(inputUsername.value)) &&
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
    (DOMPurify.sanitize(inputUsername.value).length <
      validateUsername.MIN_SYMBOLS ||
      DOMPurify.sanitize(inputUsername.value).length >
        validateUsername.MAX_SYMBOLS) &&
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
    inputPassword.value.length < validatePassword.MIN_SYMBOLS ||
    inputPassword.value.length > validatePassword.MAX_SYMBOLS
  ) {
    passwordErrors.push("Пароль должен быть не менее 8 и не более 64 символов");
  }

  if (!REGEXP.REGEXP_PASSWORD_ONE_NUMBER.test(inputPassword.value)) {
    passwordErrors.push("Пароль должен содержать хотя бы одну цифру");
  }
  if (!REGEXP.REGEX_SPEC_SYMBOL.test(inputPassword.value)) {
    passwordErrors.push("Пароль должен содержать хотя бы один спецсимвол");
  }

  if (!REGEXP.REGEXP_UPPER_LOWER_CASE.test(inputPassword.value)) {
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
  inputLogin: any,
  inputPassword: any,
  inputRepeatPassword: any,
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
export function authSignup(
  form: any,
  username: any,
  password: any,
  inputRepeatPassword: any,
) {
  if (!validateSignupForm(form, username, password, inputRepeatPassword)) {
    fetchAjax(
      "POST",
      "/api/auth/register",
      { username: username.value, password: password.value },
      (response) => {
        if (response.ok) {
          addItemLocalStorage(DOMPurify.sanitize(username.value));
          route(RouterLinks.FEED);
        } else if (response.status === 400) {
          validationErrorSignupForm(username, password, inputRepeatPassword);
        }
      },
    );
  }
}

export function updatePasswordStrengthBar(strength: number) {
  const strengthBar: any = document.querySelector(".password-strength");
  const strengthPercentage = (strength / 5) * 100; // 5 - максимальное количество критериев

  // Установка ширины и цвета в зависимости от силы пароля
  strengthBar.style.width = strengthPercentage + "%";
  if (strengthPercentage == 0) {
    strengthBar.style.width = "10%";
  }
  // Изменение цвета в зависимости от силы пароля
  if (strengthPercentage <= 40) {
    strengthBar.style.backgroundColor = "red";
  } else if (strengthPercentage < 80) {
    strengthBar.style.backgroundColor = "yellow";
  } else {
    strengthBar.style.backgroundColor = "green";
  }
}
