import { RouterLinks, state } from "../consts";
import { goToPage } from "../index";
import { authLogin, validateLoginForm } from "./login";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts";
import { route } from "../utils/routing";
import { createElement, createText, render, VirtualDOM } from "../lib/vdom/lib";
import { createElementJSX } from "../lib/jsx/lib";

export let attempts: any;

/**
 * Рендерит форму входа на страницу.
 * @returns
 */
export function renderLogin() {
  attempts = 0;
  const jsx = "<div class=background-login></div>";
  const backgroundLayer = createElementJSX(jsx);

  const vdom = new VirtualDOM(
    createElement("div", { class: ELEMENTS_CLASS.LOGIN_CONTAINER }, [
      createElement("button", { class: ELEMENTS_CLASS.CLOSE_BTN }, []),
      createElement("h2", {}, [createText("Вход")]),
      createElement("form", { class: "form-login" }, [
        createElement("input", { class: "input-login" }, []),
        createElement("i", { class: ELEMENTS_CLASS.PASSWORD_EYE }, []),
        createElement("input", { class: "input-password" }, []),
        createElement("input", { class: "submit-btn" }, []),
      ]),
      createElement("div", { class: ELEMENTS_CLASS.SIGNUP_LINK }, [
        createText("У вас нет аккаунта? "),
        createElement("a", {}, [createText("Зарегистрируйтесь")]),
      ]),
    ]),
  );
  const html = render(vdom);
  backgroundLayer.innerHTML = html;
  const closeBtn: any = backgroundLayer.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    route(RouterLinks.HOME);
  });
  closeBtn.innerHTML = "x";

  const passwordEye: any = backgroundLayer.querySelector(".password-eye");
  const inputPassword: any = backgroundLayer.querySelector(".input-password");
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

  const inputLogin: any = backgroundLayer.querySelector(".input-login");
  inputLogin.type = "text";
  inputLogin.placeholder = "Введите email или имя пользователя";
  inputLogin.required = true;

  inputPassword.type = "password";
  inputPassword.placeholder = "Введите пароль";
  inputPassword.required = true;

  const submitButton: any = backgroundLayer.querySelector(".submit-btn");
  submitButton.type = "submit";
  submitButton.value = "Войти";

  const form: any = backgroundLayer.querySelector(".form-login");
  const registerLinkAnchor: any = backgroundLayer.querySelector(
    `.${ELEMENTS_CLASS.SIGNUP_LINK}`,
  );
  registerLinkAnchor.addEventListener("click", () => {
    route(RouterLinks.SIGNUP);
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

  return backgroundLayer;
}