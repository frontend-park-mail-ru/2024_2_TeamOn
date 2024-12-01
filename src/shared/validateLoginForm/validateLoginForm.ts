import { removeError, showError } from "../utils/errors";
import { checkAttempts } from "../checkAttempts/checkAttempts";
import { maxAttempts, state } from "../consts/consts";
import { goToPage } from "../../app";
import DOMPurify from "dompurify";

/**
 * Валидирует форму входа, проверяя корректность ввода логина и пароля.
 * @param {*} form Форма входа
 * @param {*} inputLogin Поле ввода логина
 * @param {*} inputPassword Поле ввода пароля
 * @returns true, если форма содержит ошибки, false - если форма корректна.
 */
function validateLoginForm(form: any, inputLogin: any, inputPassword: any) {
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
function validateErrorLoginForm(
  inputLogin: string,
  inputPassword: string,
  attempts: any,
) {
  showError(inputLogin, "");
  showError(
    inputPassword,
    `Неправильный логин или пароль, осталось попыток: ${maxAttempts - attempts}`,
  );
  if (checkAttempts(attempts)) {
    goToPage((state.menuElements as { home: any }).home);
  }
}

export { validateLoginForm, validateErrorLoginForm };
