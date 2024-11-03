//TODO добавить в поле роль связь с бд
//TODO добавить проверку существует ли такое имя пользователя и почта
//TODO добавить обработку старого пароля

import { updatePasswordStrengthBar } from "../../auth/signup";
import { REGEXP, validatePassword } from "../../consts";
import { renderSidebar } from "../feed/feedView";
import { getCurrentUser } from "../profile/profile";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { VNode } from "../../lib/vdom/src/source";

//TODO добавить обработку старого пароля

export function validateSettingsPassword(
  inputPassword: any,
  inputRepeatPassword: any,
  passwordStrength: any,
  newPasswordError: any,
  confirmPasswordError: any,
) {
  passwordStrength = 0;

  newPasswordError.innerHTML = !inputPassword.value
    ? "Пожалуйста, введите пароль"
    : inputPassword.value.length < validatePassword.MIN_SYMBOLS
      ? `Пароль должен быть минимум ${validatePassword.MIN_SYMBOLS} символов`
      : inputPassword.value.length > validatePassword.MAX_SYMBOLS
        ? `Пароль должен быть максимум ${validatePassword.MAX_SYMBOLS} символов`
        : !REGEXP.REGEXP_PASSWORD_ONE_NUMBER.test(inputPassword.value)
          ? `В пароле должна быть одна цифра`
          : !REGEXP.REGEX_SPEC_SYMBOL.test(inputPassword.value)
            ? `В пароле должен содержаться спец символ`
            : !REGEXP.REGEXP_UPPER_LOWER_CASE.test(inputPassword.value)
              ? `Не хватает: большой и маленькой буквы`
              : "";

  passwordStrength +=
    (inputPassword.value.length >= validatePassword.MIN_SYMBOLS ? 1 : 0) +
    (inputPassword.value.length <= validatePassword.MAX_SYMBOLS ? 1 : 0) +
    (REGEXP.REGEXP_PASSWORD_ONE_NUMBER.test(inputPassword.value) ? 1 : 0) +
    (REGEXP.REGEX_SPEC_SYMBOL.test(inputPassword.value) ? 1 : 0) +
    (REGEXP.REGEXP_UPPER_LOWER_CASE.test(inputPassword.value) ? 1 : 0);

  updatePasswordStrengthBar(passwordStrength);

  confirmPasswordError.innerHTML =
    inputRepeatPassword.value !== inputPassword.value
      ? "Пароли должны совпадать"
      : "";

  if (!newPasswordError.innerHTML) {
    newPasswordError.innerHTML = "";
  }
}

export function validateMainInfo(
  username: string,
  email: string,
): { usernameError: string; emailError: string } {
  const errors = { usernameError: "", emailError: "" };

  if (!username) {
    errors.usernameError = "Имя пользователя не может быть пустым.";
  }

  if (!email || !REGEXP.REGEXP_EMAIL.test(email)) {
    errors.emailError = "Введите корректную электронную почту.";
  }

  return errors;
}
