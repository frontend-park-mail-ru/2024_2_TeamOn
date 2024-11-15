import { removeError, showError } from "../utils/errors";
import { REGEXP, validatePassword } from "../consts/consts";
import DOMPurify from "dompurify";
import { updatePasswordStrengthBar } from "../strengthBar/strengthBar";

export function validatePasswords(
  inputPassword: any,
  inputRepeatPassword: any,
  passwordStrength: any,
  hasError: any,
  check: any,
) {
  if (!inputPassword.value) {
    showError(inputPassword, "Пожалуйста, введите пароль");
    hasError = true;
    updatePasswordStrengthBar(passwordStrength);
  } else {
    // Проверка длины пароля
    if (inputPassword.value.length >= validatePassword.MIN_SYMBOLS) {
      passwordStrength++;
      updatePasswordStrengthBar(passwordStrength);
      removeError(inputPassword);
    } else {
      updatePasswordStrengthBar(passwordStrength);
      showError(
        inputPassword,
        `Пароль должен быть минимум ${validatePassword.MIN_SYMBOLS} символов`,
      );
      return;
    }
    if (inputPassword.value.length <= validatePassword.MAX_SYMBOLS) {
      updatePasswordStrengthBar(passwordStrength);
      removeError(inputPassword);
    } else {
      passwordStrength--;
      updatePasswordStrengthBar(passwordStrength);
      showError(
        inputRepeatPassword,
        `Пароль должен быть максимум ${validatePassword.MAX_SYMBOLS} символов`,
      );
      return;
    }
    if (REGEXP.REGEXP_PASSWORD_ONE_NUMBER.test(inputPassword.value)) {
      passwordStrength++;
      updatePasswordStrengthBar(passwordStrength);
      removeError(inputPassword);
    } else {
      updatePasswordStrengthBar(passwordStrength);
      showError(inputRepeatPassword, `В пароле должна быть одна цифра`);
      return;
    }
    if (REGEXP.REGEX_SPEC_SYMBOL.test(inputPassword.value)) {
      passwordStrength++;
      updatePasswordStrengthBar(passwordStrength);
      removeError(inputPassword);
    } else {
      updatePasswordStrengthBar(passwordStrength);
      showError(inputPassword, `В пароле должен содержаться спец символ`);
      return;
    }
    if (REGEXP.REGEXP_UPPER_LOWER_CASE.test(inputPassword.value)) {
      passwordStrength++;
      updatePasswordStrengthBar(passwordStrength);
      removeError(inputPassword);
    } else {
      updatePasswordStrengthBar(passwordStrength);
      showError(inputPassword, `Не хватает: большой и маленькой буквы`);
      return;
    }
  }

  // Проверка совпадения паролей
  if (inputRepeatPassword.value !== inputPassword.value) {
    showError(inputRepeatPassword, "Пароли должны совпадать");
    return;
  } else {
    passwordStrength++;
    updatePasswordStrengthBar(passwordStrength);
    removeError(inputRepeatPassword);
  }
}
/**
 * Функция валидации регистрационной формы
 * @param {*} form Форма регистрации
 * @param {*} inputUsername Поле ввода логина
 * @param {*} inputPassword Поле ввода пароля
 * @param {*} inputRepeatPassword Поле ввода повторного пароля
 * @returns true, если форма содержит ошибки, false - если форма корректна
 */

function validateSignupForm(
  form: any,
  inputUsername: any,
  inputPassword: any,
  inputRepeatPassword: any,
) {
  var errors = form.querySelectorAll(".error");
  let passwordErrors = [] as string[];

  // Удаляем все предыдущие ошибки
  for (var i = 0; i < errors.length; i++) {
    errors[i].remove();
  }

  let hasError = false;
  let passwordStrength = 0; // Переменная для хранения силы пароля

  // Проверка логина
  if (!DOMPurify.sanitize(inputUsername.value)) {
    showError(inputUsername, "Пожалуйста, введите логин");
    hasError = true;
  } else {
    removeError(inputUsername);
  }

  if (DOMPurify.sanitize(inputUsername.value).length < 4) {
    showError(inputUsername, "Логин должен иметь не менее 4 символов");
    hasError = true;
  } else {
    removeError(inputUsername);
  }
  if (DOMPurify.sanitize(inputUsername.value).length > 11) {
    showError(inputUsername, "Логин должен иметь не более 10 символов");
    hasError = true;
  } else {
    removeError(inputUsername);
  }

  // Проверка логина
  if (inputPassword.value !== inputRepeatPassword.value) {
    hasError = true;
  }

  var check = true;
  validatePasswords(
    inputPassword,
    inputRepeatPassword,
    passwordStrength,
    hasError,
    check,
  );

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
  message: string,
) {
  showError(inputPassword, message);
}
export { validateSignupForm, validationErrorSignupForm };
