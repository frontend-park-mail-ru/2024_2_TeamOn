import { state, REGEXP, validatePassword, validateUsername } from "../consts";
import { removeError, showError } from "../utils/errors";
import { fetchAjax } from "../utils/fetchAjax";
import { goToPage } from "../index";
import { addItemLocalStorage } from "../utils/storages";
import * as DOMPurify from "dompurify";



/**
 * Функция валидации регистрационной формы
 * @param {*} form Форма регистрации
 * @param {*} inputUsername Поле ввода логина
 * @param {*} inputPassword Поле ввода пароля
 * @param {*} inputRepeatPassword Поле ввода повторного пароля
 * @param {*} errors Объект для хранения ошибок
 * @returns true, если форма содержит ошибки, false - если форма корректна
 */
export function validateSignupForm(
  form: any,
  inputUsername: any,
  inputPassword: any,
  inputRepeatPassword: any,
  errors: {
    username: string;
    password: string;
    repeatPassword: string;
  }
) {
  removePreviousErrors(form);

  let hasError = false;

  hasError = validateUsernameField(inputUsername, errors, hasError);
  
  hasError = validatePasswordField(inputPassword, inputRepeatPassword, errors, hasError);

  return hasError;
}

function removePreviousErrors(form: HTMLFormElement) {
  const errors = form.querySelectorAll(".error");
  errors.forEach(error => error.remove());
}

function validateUsernameField(inputUsername: HTMLInputElement, errors: { username: string }, hasError: boolean) {
  if (!DOMPurify.sanitize(inputUsername.value)) {
    errors.username = "Пожалуйста, введите логин";
    showError(inputUsername, errors.username);
    return true;
  }

  if (!REGEXP.REGEXP_LOGIN.test(DOMPurify.sanitize(inputUsername.value))) {
    errors.username = 'Логин должен содержать хотя бы одну латинскую букву, и может содержать цифры и знаки "-" "_"';
    showError(inputUsername, errors.username);
    return true;
  }

  const usernameLength = DOMPurify.sanitize(inputUsername.value).length;
  if (usernameLength < validateUsername.MIN_SYMBOLS || usernameLength > validateUsername.MAX_SYMBOLS) {
    errors.username = "Логин должен быть не менее 4 и не более 10 символов";
    showError(inputUsername, errors.username);
    return true;
  }

  removeError(inputUsername);
  return hasError;
}

function validatePasswordField(inputPassword: HTMLInputElement, inputRepeatPassword: HTMLInputElement, errors: { password: string, repeatPassword: string }, hasError: boolean) {
  let passwordErrors = [];

  if (!inputPassword.value) {
    errors.password = "Пожалуйста, введите пароль";
    showError(inputPassword, errors.password);
    return true;
  }

  if (inputPassword.value.length < validatePassword.MIN_SYMBOLS) {
    errors.password = "Пароль должен быть не менее 8 символов";
    showError(inputPassword, errors.password);
    hasError = true; 
  } else {
    removeError(inputPassword); 
  }


  if (inputPassword.value.length > validatePassword.MAX_SYMBOLS) {
    errors.password = "Пароль должен быть не более 64 символов";
    showError(inputPassword, errors.password);
    hasError = true; 
  }
  if (!REGEXP.REGEXP_PASSWORD_ONE_NUMBER.test(inputPassword.value)) {
    errors.password = "Пароль должен содержать хотя бы одну цифру";
    showError(inputPassword, errors.password);
    hasError = true; 
  } else {
    removeError(inputPassword); 
  }

  if (!REGEXP.REGEX_SPEC_SYMBOL.test(inputPassword.value)) {
    errors.password = "Пароль должен содержать хотя бы один спецсимвол";
    showError(inputPassword, errors.password);
    hasError = true; 
  } else {
    removeError(inputPassword); 
  }


  if (!REGEXP.REGEXP_UPPER_LOWER_CASE.test(inputPassword.value)) {
    errors.password = "Пароль должен содержать хотя бы одну латинскую букву в нижнем регистре и одну в верхнем регистре";
    showError(inputPassword, errors.password);
    hasError = true; 
  } else {
    removeError(inputPassword); 
  }

  if (inputRepeatPassword.value !== inputPassword.value) {
    errors.repeatPassword = "Пароли должны совпадать";
    showError(inputRepeatPassword, errors.repeatPassword);
    hasError = true; 
  } else {
    removeError(inputRepeatPassword); 
  }

  if (!hasError) {
    removeError(inputPassword);
    removeError(inputRepeatPassword);
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
 * @param {*} submitButton Кнопка отправки формы
 */

export function authSignup(
  form: any,
  username: any,
  password: any,
  inputRepeatPassword: any,
  submitButton: HTMLInputElement
) {
  const errors = {
    username: "",
    password: "",
    repeatPassword: ""
  };

  if (!validateSignupForm(form, username, password, inputRepeatPassword, errors)) {
    submitButton.disabled = true;

    fetchAjax(
      "POST",
      "/api/auth/register",
      { username: DOMPurify.sanitize(username.value), password: password.value },
      (response) => {
        if (response.ok) {
          addItemLocalStorage(DOMPurify.sanitize(username.value));
          goToPage((state.menuElements as { profile: HTMLElement }).profile);
        } else if (response.status === 400) {
          validationErrorSignupForm(username, password, inputRepeatPassword);
        } else {
          submitButton.classList.add("error");  // Ставим светло-серый цвет
        }
      }
    ).catch((error) => {
      console.error("Ошибка при выполнении запроса:", error);
      submitButton.classList.add("error"); 
    }).finally(() => {
      submitButton.classList.remove("loading");
      submitButton.disabled = false; 
    });
  }
}
