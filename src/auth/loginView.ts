import { state } from "../consts";
import { goToPage } from "../index";
import { authLogin, validateLoginForm } from "./login";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts";
import loginTemplate from '../template/login.hbs';

export let attempts = 0;

/**
 * Рендерит форму входа на страницу.
 * @returns
 */


export function renderLogin(): HTMLElement {
  const backgroundLayer = document.createElement('div');
  backgroundLayer.innerHTML = loginTemplate({ ELEMENTS_CLASS });

  const closeBtn = backgroundLayer.querySelector<HTMLButtonElement>(`.${ELEMENTS_CLASS.CLOSE_BTN}`);
  const form = backgroundLayer.querySelector<HTMLFormElement>('form');
  const inputLogin = backgroundLayer.querySelector<HTMLInputElement>('#inputLogin');
  const inputPassword = backgroundLayer.querySelector<HTMLInputElement>('#inputPassword');
  const submitButton = backgroundLayer.querySelector<HTMLInputElement>('#submitButton');
  const registerLinkAnchor = backgroundLayer.querySelector<HTMLAnchorElement>('#registerLinkAnchor');
  const passwordEye = backgroundLayer.querySelector<HTMLElement>(`.${ELEMENTS_CLASS.PASSWORD_EYE}`);

  if (!form || !inputLogin || !inputPassword || !submitButton || !registerLinkAnchor || !closeBtn || !passwordEye) {
    throw new Error('Не удалось найти один из необходимых элементов формы');
  }

  closeBtn.onclick = () => {
    goToPage((state.menuElements as { home: HTMLElement }).home);
  };

  passwordEye.addEventListener("click", () => {
    if (inputPassword.type === "password") {
      inputPassword.type = "text";
      passwordEye.innerHTML = "&#128065;";
    } else {
      inputPassword.type = "password";
      passwordEye.innerHTML = "&#128064;";
    }
  });

  registerLinkAnchor.addEventListener("click", (e) => {
    e.preventDefault();
    goToPage((state.menuElements as { signup: HTMLElement }).signup);
  });

  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    attempts++;
    authLogin(form, inputLogin, inputPassword);
  });

  form.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      attempts++;
      authLogin(form, inputLogin, inputPassword);
    }
  });

  form.addEventListener("input", (e) => {
    e.preventDefault();
    validateLoginForm(form, inputLogin, inputPassword);
  });

  return backgroundLayer;
}
