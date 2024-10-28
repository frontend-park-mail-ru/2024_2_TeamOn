//TODO имя пользователя и почту в поле изменения
//TODO добавить в поле роль связь с бд

import { updatePasswordStrengthBar } from "../../auth/signup";
import { REGEXP, validatePassword } from "../../consts";

//TODO добавить обработку старого пароля

export function validateSettingsPassword(
  inputPassword: any,
  inputRepeatPassword: any,
  passwordStrength: any,
  newPasswordError: any,
  confirmPasswordError: any,
) {
  if (!inputPassword.value) {
    newPasswordError.innerHTML = "Пожалуйста, введите пароль";
    updatePasswordStrengthBar(passwordStrength);
  } else {
    // Проверка длины пароля
    if (inputPassword.value.length >= validatePassword.MIN_SYMBOLS) {
      passwordStrength++;
      // Изменение цвета шкалы
      newPasswordError.innerHTML = "";
      updatePasswordStrengthBar(passwordStrength);
    } else {
      newPasswordError.innerHTML = `Пароль должен быть минимум ${validatePassword.MIN_SYMBOLS} символов`;
      updatePasswordStrengthBar(passwordStrength);
      return;
    }
    if (inputPassword.value.length <= validatePassword.MAX_SYMBOLS) {
      newPasswordError.innerHTML = "";
      updatePasswordStrengthBar(passwordStrength);
    } else {
      passwordStrength--;
      newPasswordError.innerHTML = `Пароль должен быть максимум ${validatePassword.MAX_SYMBOLS} символов`;
      updatePasswordStrengthBar(passwordStrength);
      return;
    }
    if (REGEXP.REGEXP_PASSWORD_ONE_NUMBER.test(inputPassword.value)) {
      passwordStrength++;
      newPasswordError.innerHTML = "";
      updatePasswordStrengthBar(passwordStrength);
    } else {
      newPasswordError.innerHTML = `В пароле должна быть одна цифра`;
      updatePasswordStrengthBar(passwordStrength);
      return;
    }
    if (REGEXP.REGEX_SPEC_SYMBOL.test(inputPassword.value)) {
      passwordStrength++;
      newPasswordError.innerHTML = "";
      updatePasswordStrengthBar(passwordStrength);
    } else {
      newPasswordError.innerHTML = `В пароле должен содержаться спец символ`;
      updatePasswordStrengthBar(passwordStrength);
      return;
    }
    if (REGEXP.REGEXP_UPPER_LOWER_CASE.test(inputPassword.value)) {
      passwordStrength++;
      newPasswordError.innerHTML = "";
      updatePasswordStrengthBar(passwordStrength);
    } else {
      newPasswordError.innerHTML = `Не хватает: большой и маленькой буквы`;
      updatePasswordStrengthBar(passwordStrength);
      return;
    }
  }

  // Проверка совпадения паролей

  if (inputRepeatPassword.value !== inputPassword.value) {
    newPasswordError.innerHTML = `Пароли должны совпадать`;
  } else {
    confirmPasswordError.innerHTML = "";
  }
}

export function validateSettingsPersonalize(
  email: string,
  emailError: any,
  username: string,
  usernameError: any,
) {
  if (!email || !REGEXP.REGEXP_EMAIL.test(email)) {
    emailError.innerHTML = `Введите корректную электронную почту`;
  }
}
