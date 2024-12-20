import { REGEXP, validatePassword } from "../consts/consts";
import { updatePasswordStrengthBar } from "../strengthBar/strengthBar";
/**
 * Валидация пароля для настроек
 * @param inputPassword Входящий пароль
 * @param inputRepeatPassword Повторения входящего пароля
 * @param passwordStrength Длина шкалы заполнения валидности пароля
 * @param newPasswordError Ошибка валидности старого пароля
 * @param confirmPasswordError Ошибка валидности подтвержденного пароля
 */
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
              : inputRepeatPassword.value !== inputPassword.value
                ? "Пароли должны совпадать"
                : "";

  passwordStrength +=
    (inputPassword.value.length >= validatePassword.MIN_SYMBOLS ? 1 : 0) +
    (inputPassword.value.length <= validatePassword.MAX_SYMBOLS ? 1 : 0) +
    (REGEXP.REGEXP_PASSWORD_ONE_NUMBER.test(inputPassword.value) ? 1 : 0) +
    (REGEXP.REGEX_SPEC_SYMBOL.test(inputPassword.value) ? 1 : 0) +
    (REGEXP.REGEXP_UPPER_LOWER_CASE.test(inputPassword.value) ? 1 : 0);
  passwordStrength -= inputRepeatPassword.value !== inputPassword.value ? 1 : 0;
  updatePasswordStrengthBar(passwordStrength);

  if (!newPasswordError.innerHTML) {
    newPasswordError.innerHTML = "";
  }
  if (inputPassword.value == "") {
    const strengthBar: any = document.querySelector(".password-strength");
    strengthBar.style.width = "0%";
    newPasswordError.textContent = "";
  }
}
/**
 * Валидация основной информации
 * @param username Имя
 * @param email Почта
 * @returns
 */
export function validateMainInfo(
  username: string,
  email: string,
): { usernameError: string; emailError: string } {
  const errors = { usernameError: "", emailError: "" };

  if (!username && email === "") {
    errors.usernameError = "Имя пользователя не может быть пустым";
  }

  if ((!email || !REGEXP.REGEXP_EMAIL.test(email)) && username === "") {
    errors.emailError = "Введите корректную электронную почту";
  }

  return errors;
}
