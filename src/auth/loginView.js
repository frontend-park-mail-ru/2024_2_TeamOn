import { state } from "../consts.js";
import { goToPage } from "../index.js";
import { authLogin, validateErrorLoginForm } from "./login.js";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts.js";

export const form = document.createElement(ELEMENTS.FORM);
export let attempts = 0;

export function renderLogin() {
  const backgroundLayer = document.createElement(ELEMENTS.DIV);
  backgroundLayer.className = ELEMENTS_CLASS.BACKGROUND_LOGIN;

  const loginContainer = document.createElement(ELEMENTS.DIV);
  const h2 = document.createElement(ELEMENTS.H2);
  const form = document.createElement(ELEMENTS.FORM);
  const inputLogin = document.createElement(ELEMENTS.INPUT);
  const inputPassword = document.createElement(ELEMENTS.INPUT);
  const submitButton = document.createElement(ELEMENTS.INPUT);
  const registerLink = document.createElement(ELEMENTS.DIV);
  const registerLinkAnchor = document.createElement(ELEMENTS.A);
  const closeBtn = document.createElement(ELEMENTS.BUTTON);

  closeBtn.className = ELEMENTS_CLASS.CLOSE_BTN;
  closeBtn.innerHTML = "x";
  closeBtn.onclick = () => {
    goToPage(state.menuElements.home);
  };

  loginContainer.className = ELEMENTS_CLASS.LOGIN_CONTAINER;

  loginContainer.appendChild(closeBtn);
  loginContainer.appendChild(h2);

  h2.textContent = "Вход";

  loginContainer.appendChild(form);

  inputLogin.type = "text";
  inputLogin.placeholder = "Введите email или имя пользователя";
  inputLogin.required = true;
  form.appendChild(inputLogin);

  inputPassword.type = "password";
  inputPassword.placeholder = "Введите пароль";
  inputPassword.required = true;
  form.appendChild(inputPassword);

  submitButton.type = "submit";
  submitButton.value = "Войти";
  form.appendChild(submitButton);

  registerLink.className = ELEMENTS_CLASS.SIGNUP_LINK;
  registerLink.textContent = "У вас нет аккаунта? ";
  registerLinkAnchor.textContent = "Зарегистрируйтесь";
  registerLink.appendChild(registerLinkAnchor);
  loginContainer.appendChild(registerLink);

  registerLinkAnchor.addEventListener("click", () => {
    goToPage(state.menuElements.signup);
  });

  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    attempts++;
    authLogin(form, inputLogin, inputPassword);
  });

  submitButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      attempts++;
      authLogin(form, inputLogin, inputPassword);
    }
  });
  form.addEventListener("input", (e) => {
    e.preventDefault();
    validateErrorLoginForm(form, inputLogin, inputPassword);
  });

  backgroundLayer.appendChild(loginContainer);
  return backgroundLayer;
}
