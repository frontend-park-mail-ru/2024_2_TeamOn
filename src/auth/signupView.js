import Handlebars from 'handlebars';
import { state } from "../consts.js";
import { goToPage } from "../index.js";
import { authSignup, validateSignupForm } from "./signup.js";
import { ELEMENTS_CLASS } from "../consts.js";
import signupTemplate from '../templates/signupTemplate.hbs'; 

export function renderSignup() {
  const templateContext = {
    ELEMENTS_CLASS
  };

  const backgroundLayer = document.createElement('div');
  backgroundLayer.innerHTML = signupTemplate(templateContext);

  const form = backgroundLayer.querySelector('#signupForm');
  const inputUsername = backgroundLayer.querySelector('#inputUsername');
  const inputPassword = backgroundLayer.querySelector('#inputPassword');
  const inputRepeatPassword = backgroundLayer.querySelector('#inputRepeatPassword');


  form.addEventListener("submit", (e) => {
    e.preventDefault();
    authSignup(form, inputUsername, inputPassword, inputRepeatPassword);
  });

  form.addEventListener("input", () => {
    validateSignupForm(form, inputUsername, inputPassword, inputRepeatPassword);
  });

  const closeBtn = backgroundLayer.querySelector('.{{ELEMENTS_CLASS.CLOSE_BTN}}');
  closeBtn.onclick = () => {
    goToPage(state.menuElements.home);
  };

  return backgroundLayer;
}
