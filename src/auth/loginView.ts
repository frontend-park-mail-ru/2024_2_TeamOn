import { LINKS } from "../consts";
import { authLogin, validateLoginForm } from "./login";
import { ELEMENTS_CLASS } from "../consts";
import { route } from "../utils/routing";
import { createElement, createText, update } from "../lib/vdom/lib";
import { pageContainer } from "../index";
import { findUsername } from "../utils/hasLogged";
import { removeItemLocalStorage } from "../utils/storages";
import { VNode } from "../lib/vdom/src/source";

export let attempts: any;

/**
 * Рендерит форму входа на страницу.
 * @returns
 */
export function renderLogin() {
  attempts = 0;

  const vdom: VNode = createElement("div", { class: "login" }, [
    createElement("div", { class: ELEMENTS_CLASS.LOGIN.ELEMENT }, [
      createElement("button", { class: ELEMENTS_CLASS.CLOSE_BTN.COMBINE }, []),
      createElement("h2", {}, [createText("Вход")]),
      createElement("form", { class: "form-login" }, [
        createElement("input", { class: "input-login" }, []),
        createElement("i", { class: ELEMENTS_CLASS.PASSWORD_EYE }, []),
        createElement("input", { class: "input-password" }, []),
        createElement("input", { class: "submit-btn" }, []),
      ]),
      createElement("div", { class: ELEMENTS_CLASS.SIGNUP_LINK.BLOCK }, [
        createText("У вас нет аккаунта? "),
        createElement("a", { class: ELEMENTS_CLASS.SIGNUP_LINK.COMBINE }, [
          createText("Зарегистрируйтесь"),
        ]),
      ]),
    ]),
  ]);
  const container = update(pageContainer, vdom);

  const closeBtn: any = container.querySelector(
    `.${ELEMENTS_CLASS.CLOSE_BTN.ELEMENT}`,
  );
  closeBtn.addEventListener("click", () => {
    route(LINKS.HOME.HREF);
  });
  closeBtn.innerHTML = "x";

  const passwordEye: any = container.querySelector(".password-eye");
  passwordEye.innerHTML = "&#128064;";
  passwordEye.addEventListener("click", () => {
    if (inputPassword.type === "password") {
      inputPassword.type = "text";
      passwordEye.innerHTML = "&#128065;";
    } else {
      inputPassword.type = "password";
      passwordEye.innerHTML = "&#128064;";
    }
  });

  const inputLogin: any = container.querySelector(".input-login");
  inputLogin.type = "text";
  inputLogin.placeholder = "Введите email или имя пользователя";
  inputLogin.required = true;

  const inputPassword: any = container.querySelector(".input-password");
  inputPassword.type = "password";
  inputPassword.placeholder = "Введите пароль";
  inputPassword.required = true;

  const submitButton: any = container.querySelector(".submit-btn");
  submitButton.type = "submit";
  submitButton.value = "Войти";

  const form: any = container.querySelector(".form-login");
  const registerLinkAnchor: any = container.querySelector(
    `.${ELEMENTS_CLASS.SIGNUP_LINK.ELEMENT}`,
  );
  registerLinkAnchor.addEventListener("click", () => {
    route(LINKS.SIGNUP.HREF);
  });
  submitButton.addEventListener("click", (e: any) => {
    e.preventDefault();
    attempts++;
    authLogin(form, inputLogin, inputPassword);
  });

  submitButton.addEventListener("keydown", (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      attempts++;
      authLogin(form, inputLogin, inputPassword);
    }
  });
  form.addEventListener("input", (e: any) => {
    e.preventDefault();
    validateLoginForm(form, inputLogin, inputPassword);
  });

  removeItemLocalStorage(findUsername());
  return container;
}
