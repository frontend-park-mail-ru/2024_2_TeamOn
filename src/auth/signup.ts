import {
  REGEXP,
  validatePassword,
  LINKS,
  LOCATIONS,
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
  var check = true;
  // Проверка пароля
  if (!inputPassword.value) {
    showError(inputPassword, "Пожалуйста, введите пароль");
    hasError = true;
    updatePasswordStrengthBar(passwordStrength);
  } else {
    // Проверка длины пароля
    if (inputPassword.value.length >= validatePassword.MIN_SYMBOLS && check) {
      passwordStrength++;
      // Изменение цвета шкалы
      updatePasswordStrengthBar(passwordStrength);
      removeError(inputPassword);
      check = false;
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
    hasError = true;
  } else {
    removeError(inputRepeatPassword);
  }

  // Отображение ошибок пароля
  if (passwordErrors.length > 0) {
    showError(inputRepeatPassword, passwordErrors.join("<br>"));
    hasError = true;
  }

  return hasError;
}

// Функция для обновления шкалы силы пароля

function updatePasswordStrengthBar(strength: number) {
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
      LOCATIONS.SIGNUP.METHOD,
      LOCATIONS.SIGNUP.HREF,
      { username: username.value, password: password.value },
      (response) => {
        if (response.ok) {
          addItemLocalStorage(DOMPurify.sanitize(username.value));
          route(LINKS.FEED.HREF);
        } else if (response.status === 400) {
          response.json().then((data) => {
            validationErrorSignupForm(
              username,
              password,
              inputRepeatPassword,
              data.message,
            );
          });
        }
      },
    );
  }
}
