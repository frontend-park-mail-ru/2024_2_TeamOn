import { state } from '../consts.js';
import {goToPage} from '../index.js'
import { authLogin, validateErrorLoginForm } from './login.js';

export const form = document.createElement('form');
export let attempts = 0;

export function renderLogin() {
    const backgroundLayer = document.createElement("div");
  backgroundLayer.className = "background-login";

  const loginContainer = document.createElement("div");
  const h2 = document.createElement("h2");
  const form = document.createElement("form");
  const inputLogin = document.createElement("input");
  const inputPassword = document.createElement("input");
  const submitButton = document.createElement("input");
  const registerLink = document.createElement("div");
  const registerLinkAnchor = document.createElement("a");
  const closeBtn = document.createElement("button");

  closeBtn.className = "close-btn";
  closeBtn.innerHTML = "x";
  closeBtn.onclick = () => {
    goToPage(state.menuElements.home);
  };

  loginContainer.className = "login-container";

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

  registerLink.className = "register-link";
  registerLink.textContent = "У вас нет аккаунта? ";
  registerLinkAnchor.textContent = "Зарегистрируйтесь";
  registerLink.appendChild(registerLinkAnchor);
  loginContainer.appendChild(registerLink);

    registerLinkAnchor.addEventListener('click', (e) => {
        goToPage(state.menuElements.signup);
    });
    
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        attempts++;
        authLogin(form, inputLogin, inputPassword);

    });

    submitButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();  
            attempts++;
            authLogin(form, inputLogin, inputPassword);
        }
    });
    form.addEventListener('input', (e) => {
        e.preventDefault();
        validateErrorLoginForm(form, inputLogin, inputPassword);
    });

    backgroundLayer.appendChild(loginContainer);
    return backgroundLayer;
    
}