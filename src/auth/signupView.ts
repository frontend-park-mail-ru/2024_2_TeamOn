import { state } from "../consts";
import { goToPage } from "../index";
import { authSignup, validateSignupForm } from "./signup";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts";
import signupTemplate from '../template/signup.hbs';

/**
 * Функция рендерит форму регистрации.
 * @returns
 */

export function renderSignup(): HTMLElement {
  const backgroundLayer = document.createElement('div');
  backgroundLayer.innerHTML = signupTemplate({ ELEMENTS_CLASS });

  const closeBtn = backgroundLayer.querySelector<HTMLButtonElement>(`.${ELEMENTS_CLASS.CLOSE_BTN}`);
  const form = backgroundLayer.querySelector<HTMLFormElement>('form');
  const inputUsername = backgroundLayer.querySelector<HTMLInputElement>('#inputUsername');
  const inputPassword = backgroundLayer.querySelector<HTMLInputElement>('#inputPassword');
  const inputRepeatPassword = backgroundLayer.querySelector<HTMLInputElement>('#inputRepeatPassword');
  const buttonRegister = backgroundLayer.querySelector<HTMLInputElement>('#buttonRegister');
  const loginLinkAnchor = backgroundLayer.querySelector<HTMLAnchorElement>('#loginLinkAnchor');

  if (!form || !inputUsername || !inputPassword || !inputRepeatPassword || !buttonRegister || !loginLinkAnchor || !closeBtn) {
    throw new Error('Не удалось найти один из необходимых элементов формы');
  }

  const errors = {
    username: '',
    password: '',
    repeatPassword: '',
  };

  const createErrorContainer = () => {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error';
    errorContainer.style.height = '20px'; 
    return errorContainer;
  };

  const usernameErrorContainer = createErrorContainer();
  const passwordErrorContainer = createErrorContainer();
  const repeatPasswordErrorContainer = createErrorContainer();

  // Добавляем контейнеры для ошибок в форму
  form.insertBefore(usernameErrorContainer, inputPassword);
  form.insertBefore(passwordErrorContainer, inputRepeatPassword);
  form.insertBefore(repeatPasswordErrorContainer, buttonRegister);

  closeBtn.onclick = () => {
    goToPage((state.menuElements as { home: HTMLElement }).home);
  };

  loginLinkAnchor.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    goToPage((state.menuElements as { login: HTMLElement }).login);
  });

  buttonRegister.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    authSignup(form, inputUsername, inputPassword, inputRepeatPassword, buttonRegister);
  });

  form.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      authSignup(form, inputUsername, inputPassword, inputRepeatPassword, buttonRegister);
    }
  });

  form.addEventListener("input", (e: Event) => {
    e.preventDefault();
    
    validateSignupForm(form, inputUsername, inputPassword, inputRepeatPassword, errors);

    usernameErrorContainer.textContent = errors.username;
    passwordErrorContainer.textContent = errors.password;
    repeatPasswordErrorContainer.textContent = errors.repeatPassword;
  });

  return backgroundLayer;
}
