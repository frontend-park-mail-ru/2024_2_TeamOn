<<<<<<< HEAD
//TODO добавить в поле роль связь с бд
//TODO добавить проверку существует ли такое имя пользователя и почта 
//TODO добавить обработку старого пароля
=======
//TODO имя пользователя и почту в поле изменения
//TODO добавить в поле роль связь с бд
>>>>>>> 9d42475ac93784d07320ccdb38ff5a0f802b4773

import { updatePasswordStrengthBar } from "../../auth/signup";
import { REGEXP, validatePassword } from "../../consts";

<<<<<<< HEAD
=======
//TODO добавить обработку старого пароля

>>>>>>> 9d42475ac93784d07320ccdb38ff5a0f802b4773
export function validateSettingsPassword(
  inputPassword: any,
  inputRepeatPassword: any,
  passwordStrength: any,
  newPasswordError: any,
  confirmPasswordError: any,
) {
<<<<<<< HEAD
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

  confirmPasswordError.innerHTML = inputRepeatPassword.value !== inputPassword.value
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


=======
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
>>>>>>> 9d42475ac93784d07320ccdb38ff5a0f802b4773
