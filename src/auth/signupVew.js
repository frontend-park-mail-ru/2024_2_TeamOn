import { state } from "../consts.js";
import { goToPage } from "../index.js";
import { authSignup, validateSignupForm } from "./signup.js";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts.js";

export function renderSignup() {
  const backgroundLayer = document.createElement(ELEMENTS.DIV);
  backgroundLayer.className = ELEMENTS_CLASS.BACKGROUND_SIGNUP;

  const form = document.createElement(ELEMENTS.FORM);
  form.className = ELEMENTS_CLASS.CONTAINER_SIGNUP;

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

  const buttonRegister = document.createElement(ELEMENTS.INPUT);
  buttonRegister.value = "Зарегистрироваться";
  buttonRegister.type = "submit";

  form.append(closeBtn);
  form.appendChild(h2);
  form.appendChild(inputUsername);
  form.appendChild(inputPassword);
  form.appendChild(inputRepeatPassword);
  form.appendChild(buttonRegister);

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

  backgroundLayer.appendChild(form);
  return backgroundLayer;
}
