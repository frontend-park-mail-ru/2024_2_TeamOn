import { RouterLinks, state } from "../consts";
import { goToPage } from "../index";
import { authSignup, validateSignupForm } from "./signup";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts";
import { route } from "../utils/routing";
import { createElement, createText, render, VirtualDOM } from "../lib/vdom/lib";
import { createElementJSX } from "../lib/jsx/lib";

/**
 * Функция рендерит форму регистрации.
 * @returns
 */
export function renderSignup() {
  const jsx = "<div class=background-signup></div>";
  const container = createElementJSX(jsx);

  const vdom = new VirtualDOM(
    createElement("div", { class: ELEMENTS_CLASS.SIGNUP_CONTAINER }, [
      createElement("button", { class: ELEMENTS_CLASS.CLOSE_BTN }, []),
      createElement("h2", {}, [createText("Регистрация")]),
      createElement("form", { class: "form-signup" }, [
        createElement("input", { class: "input-username" }, []),
        createElement("input", { class: "input-password" }, []),
        createElement("input", { class: "input-repeatPassword" }, []),
        createElement("input", { class: "button-signup" }, []),
      ]),
      createElement("div", { class: ELEMENTS_CLASS.LOGIN_LINK }, [
        createText("У вас уже есть аккаунт? "),
        createElement("a", {}, [createText("Войти")]),
      ]),
    ]),
  );
  const html = render(vdom);
  container.innerHTML = html;

  const form: any = container.querySelector(`.form-signup`);
  const inputUsername: any = container.querySelector(`.input-username`);
  const inputPassword: any = container.querySelector(`.input-password`);
  const inputRepeatPassword: any = container.querySelector(
    `.input-repeatPassword`,
  );

  inputUsername.type = "text";
  inputUsername.placeholder = "Введите имя пользователя";

  inputPassword.type = "password";
  inputPassword.placeholder = "Придумайте пароль (минимум 8 символов)";

  inputRepeatPassword.type = "password";
  inputRepeatPassword.placeholder = "Повторите пароль";

  const closeBtn: any = container.querySelector(`.${ELEMENTS_CLASS.CLOSE_BTN}`);
  closeBtn.innerHTML = "x";
  closeBtn.onclick = () => {
    route(RouterLinks.HOME);
  };

  const loginLinkAnchor: any = container.querySelector(
    `.${ELEMENTS_CLASS.LOGIN_LINK}`,
  );
  loginLinkAnchor.addEventListener("click", () => {
    goToPage((state.menuElements as { login: HTMLElement }).login);
  });

  const buttonRegister: any = container.querySelector(".button-signup");
  buttonRegister.addEventListener("click", (e: any) => {
    e.preventDefault();
    authSignup(form, inputUsername, inputPassword, inputRepeatPassword);
  });
  buttonRegister.value = "Зарегистрироваться";
  buttonRegister.type = "submit";

  form.addEventListener("keydown", (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      authSignup(form, inputUsername, inputPassword, inputRepeatPassword);
    }
  });

  form.addEventListener("input", (e: any) => {
    e.preventDefault();
    validateSignupForm(form, inputUsername, inputPassword, inputRepeatPassword);
  });

  return container;
}
