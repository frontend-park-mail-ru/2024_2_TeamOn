import { state, maxAttempts } from "../consts";
import { removeError, showError } from "../utils/errors";
import { fetchAjax } from "../utils/fetchAjax";
import { goToPage } from "../index";
import { attempts } from "./loginView";
import { addItemLocalStorage } from "../utils/storages";
import * as DOMPurify from "dompurify";

/**
 * Валидирует форму входа, проверяя корректность ввода логина и пароля.
 * @param {*} form Форма входа
 * @param {*} inputLogin Поле ввода логина
 * @param {*} inputPassword Поле ввода пароля
 * @returns true, если форма содержит ошибки, false - если форма корректна.
 */
export function validateLoginForm(
  form: any,
  inputLogin: any,
  inputPassword: any,
) {
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

  if (!inputPassword.value) {
    showError(inputPassword, "Пожалуйста, введите пароль");
    hasError = true;
  } else {
    removeError(inputPassword);
  }

  return hasError;
}

/**
 * Выводит ошибку регистрации, если логин и пароль.
 * @param {*} inputLogin Поле ввода логина
 * @param {*} inputPassword Поле ввода пароля
 */
function validateErrorLoginForm(inputLogin: any, inputPassword: any) {
  showError(inputLogin, "");
  showError(
    inputPassword,
    `Неправильный логин или пароль, осталось попыток: ${maxAttempts - attempts}`,
  );
  if (checkAttempts(attempts)) {
    goToPage((state.menuElements as { home: HTMLElement }).home);
  }
}

/**
 * Авторизирует нового пользователя, если форма авторизации корректна.
 * @param {*} form Форма авторизации
 * @param {*} username Поле ввода логина
 * @param {*} password Поле ввода пароля
 * @param {*} inputRepeatPassword Поле ввода повторного пароля
 */
export function authLogin(form: any, inputLogin: any, inputPassword: any) {
  if (!validateLoginForm(form, inputLogin, inputPassword)) {
    fetchAjax(
      "POST",
      "/api/auth/login",
      { username: inputLogin.value, password: inputPassword.value },
      (response) => {
        if (response.ok) {
          addItemLocalStorage(DOMPurify.sanitize(inputLogin.value));
          goToPage((state.menuElements as { profile: HTMLElement }).profile);
        } else if (response.status === 400) {
          validateErrorLoginForm(inputLogin, inputPassword);
        }
      },
    );
  }
}

function checkAttempts(attempts: number) {
  return attempts > maxAttempts;
}
