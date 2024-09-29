import { state } from "../consts.js";
import { goToPage } from "../index.js";
import { authSignup, validateSignupForm } from "./signup.js";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts.js";

/**
 * Функция рендерит форму регистрации.
 * @returns
 */
export function renderSignup() {
  const backgroundLayer = document.createElement(ELEMENTS.DIV);
  backgroundLayer.className = ELEMENTS_CLASS.BACKGROUND_SIGNUP;

  const signupContainer = document.createElement(ELEMENTS.DIV);
  signupContainer.className = ELEMENTS_CLASS.SIGNUP_CONTAINER;

  const form = document.createElement(ELEMENTS.FORM);

  const closeBtn = document.createElement(ELEMENTS.BUTTON);

  closeBtn.className = ELEMENTS_CLASS.CLOSE_BTN;
  closeBtn.innerHTML = "x";
  closeBtn.onclick = () => {
    goToPage(state.menuElements.home);
  };

  const h2 = document.createElement(ELEMENTS.H2);
  h2.textContent = "Регистрация";

  const inputUsername = document.createElement(ELEMENTS.INPUT);
  inputUsername.type = "text";
  inputUsername.placeholder = "Введите имя пользователя";

  const inputPassword = document.createElement(ELEMENTS.INPUT);
  inputPassword.type = "password";
  inputPassword.placeholder = "Придумайте пароль (минимум 8 символов)";

  const inputRepeatPassword = document.createElement(ELEMENTS.INPUT);
  inputRepeatPassword.type = "password";
  inputRepeatPassword.placeholder = "Повторите пароль";

  const loginLink = document.createElement(ELEMENTS.DIV);
  loginLink.className = ELEMENTS_CLASS.LOGIN_LINK;
  loginLink.textContent = "У вас аккаунт? ";

  const loginLinkAnchor = document.createElement(ELEMENTS.A);
  loginLinkAnchor.textContent = "Войти";

  loginLink.appendChild(loginLinkAnchor);

  const buttonRegister = document.createElement(ELEMENTS.INPUT);
  buttonRegister.value = "Зарегистрироваться";
  buttonRegister.type = "submit";

  signupContainer.append(closeBtn);
  signupContainer.appendChild(h2);
  signupContainer.appendChild(form);
  signupContainer.appendChild(loginLink);
  form.appendChild(inputUsername);
  form.appendChild(inputPassword);
  form.appendChild(inputRepeatPassword);
  form.appendChild(buttonRegister);

  loginLinkAnchor.addEventListener("click", () => {
    goToPage(state.menuElements.login);
  });

  buttonRegister.addEventListener("click", (e) => {
    e.preventDefault();
    authSignup(form, inputUsername, inputPassword, inputRepeatPassword);
  });

  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      authSignup(form, inputUsername, inputPassword, inputRepeatPassword);
    }
  });

  form.addEventListener("input", (e) => {
    e.preventDefault();
    validateSignupForm(form, inputUsername, inputPassword, inputRepeatPassword);
  });

  backgroundLayer.appendChild(signupContainer);
  return backgroundLayer;
}
