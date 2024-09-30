import Handlebars from 'handlebars';
import { state, ELEMENTS_CLASS } from "../consts.js";
import { goToPage } from "../index.js";
import { authLogin, validateErrorLoginForm } from "./login.js";
import loginTemplate from '../templates/loginTemplate.hbs'; 

export let attempts = 0;

export function renderLogin() {
  const templateContext = {
    ELEMENTS_CLASS
  };
  document.getElementById('app').innerHTML = loginTemplate(templateContext); 

  const form = document.getElementById('loginForm');
  const inputLogin = document.getElementById('inputLogin');
  const inputPassword = document.getElementById('inputPassword');
  const passwordEye = document.getElementById('passwordEye');
  const registerLink = document.getElementById('registerLink');


  passwordEye.addEventListener("click", () => {
    if (inputPassword.type === "password") {
      inputPassword.type = "text";
      passwordEye.innerHTML = "&#128065;"; 
    } else {
      inputPassword.type = "password";
      passwordEye.innerHTML = "&#128064;"; 
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    attempts++;
    authLogin(form, inputLogin, inputPassword);
  });
  registerLink.addEventListener("click", (e) => {
    e.preventDefault();
    goToPage(state.menuElements.signup);
  });

  form.addEventListener("input", () => {
    validateErrorLoginForm(form, inputLogin, inputPassword);
  });
}
