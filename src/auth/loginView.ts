import { RouterLinks, state } from "../consts";
import { goToPage } from "../index";
import { authLogin, validateLoginForm } from "./login";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts";
import { route } from "../utils/routing";
import { createElement, createText, VirtualDOM } from "../lib/vdom/lib";

export let attempts: any;

/**
 * Рендерит форму входа на страницу.
 * @returns
 */
export function renderLogin() {
  attempts = 0;
  const backgroundLayer = document.createElement(
    ELEMENTS.DIV,
  ) as HTMLInputElement;
  backgroundLayer.className = ELEMENTS_CLASS.BACKGROUND_LOGIN;

  const vdom = new VirtualDOM(
    createElement("div", { class: "vdom" }, [
      createElement("div", { class: "home-overlay" }, []),
      createElement("div", { class: "home-header" }, [createText("PUSHART")]),
      createElement("div", { class: "home-buttons" }, [
        createElement("a", { class: "home-button" }, [createText("Войти")]),
      ]),
    ]),
  );
  // const loginContainer = document.createElement(
  //   ELEMENTS.DIV,
  // ) as HTMLInputElement;
  // const h2 = document.createElement(ELEMENTS.H2) as HTMLInputElement;
  // const form = document.createElement(ELEMENTS.FORM) as HTMLInputElement;
  // const inputLogin = document.createElement(ELEMENTS.INPUT) as HTMLInputElement;
  // const inputPassword = document.createElement(
  //   ELEMENTS.INPUT,
  // ) as HTMLInputElement;
  // const submitButton = document.createElement(
  //   ELEMENTS.INPUT,
  // ) as HTMLInputElement;
  // const registerLink = document.createElement(ELEMENTS.DIV) as HTMLInputElement;
  // const registerLinkAnchor = document.createElement(
  //   ELEMENTS.A,
  // ) as HTMLInputElement;
  // const closeBtn = document.createElement(ELEMENTS.BUTTON) as HTMLInputElement;
  // const passwordEye = document.createElement(ELEMENTS.I) as HTMLInputElement;

  // closeBtn.className = ELEMENTS_CLASS.CLOSE_BTN;
  // closeBtn.innerHTML = "x";
  // closeBtn.onclick = () => {
  //   goToPage((state.menuElements as { home: HTMLElement }).home);
  // };

  // loginContainer.className = ELEMENTS_CLASS.LOGIN_CONTAINER;

  // loginContainer.appendChild(closeBtn);
  // loginContainer.appendChild(h2);

  // h2.textContent = "Вход";

  // loginContainer.appendChild(form);

  // inputLogin.type = "text";
  // inputLogin.placeholder = "Введите email или имя пользователя";
  // inputLogin.required = true;
  // form.appendChild(inputLogin);

  // passwordEye.className = ELEMENTS_CLASS.PASSWORD_EYE;
  // passwordEye.innerHTML = "&#128064;";
  // form.appendChild(passwordEye);

  // inputPassword.type = "password";
  // inputPassword.placeholder = "Введите пароль";
  // inputPassword.required = true;
  // form.appendChild(inputPassword);

  // passwordEye.addEventListener("click", () => {
  //   if (inputPassword.type === "password") {
  //     inputPassword.type = "text";
  //     passwordEye.innerHTML = "&#128065;";
  //   } else {
  //     inputPassword.type = "password";
  //     passwordEye.innerHTML = "&#128064;";
  //   }
  // });

  // submitButton.type = "submit";
  // submitButton.value = "Войти";
  // form.appendChild(submitButton);

  // registerLink.className = ELEMENTS_CLASS.SIGNUP_LINK;
  // registerLink.textContent = "У вас нет аккаунта? ";
  // registerLinkAnchor.textContent = "Зарегистрируйтесь";
  // registerLink.appendChild(registerLinkAnchor);
  // loginContainer.appendChild(registerLink);

  // registerLinkAnchor.addEventListener("click", () => {
  //   //goToPage((state.menuElements as { signup: HTMLElement }).signup);
  //   route(RouterLinks.SIGNUP);
  // });

  // submitButton.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   attempts++;
  //   authLogin(form, inputLogin, inputPassword);
  // });

  // submitButton.addEventListener("keydown", (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     attempts++;
  //     authLogin(form, inputLogin, inputPassword);
  //   }
  // });
  // form.addEventListener("input", (e) => {
  //   e.preventDefault();
  //   validateLoginForm(form, inputLogin, inputPassword);
  // });

  // backgroundLayer.appendChild(loginContainer);

  return backgroundLayer;
}
