import { LINKS } from "../../shared/consts/consts";
import { ELEMENTS_CLASS } from "../../shared/consts/consts";
import { route } from "../../shared/routing/routing";
import { update } from "../../../lib/vdom/lib";
import { pageContainer, urlEyeNoSeePassword, urlEyeSeePassword, urlLogin } from "../../app/index";
import { findUsername } from "../../shared/utils/hasLogged";
import { removeItemLocalStorage } from "../../shared/utils/storages";
import { VNode } from "../../../lib/vdom/src/source";
import { containerLogin } from "./ui/login";
import { authLogin } from "../../features/authLogin/authLogin";
import { validateLoginForm } from "../../shared/validateLoginForm/validateLoginForm";
import { setTitle } from "../../shared/settitle/setTitle";
import { setStatic } from "../../shared/getStatic/getStatic";
/**
 * Рендерит форму входа на страницу.
 * @returns
 */
export async function renderLogin() {
  setTitle(LINKS.LOGIN.TEXT);

  let attempts = 0;

  const vdom: VNode = containerLogin();

  const container = update(pageContainer, vdom);

  const mainContainer: any = container.querySelector(`.login`);

  setStatic(mainContainer, urlLogin);

  const iconEye: any = container.querySelector(`.password-eye`);

  const closeBtn: any = container.querySelector(
    `.${ELEMENTS_CLASS.CLOSE_BTN.ELEMENT}`,
  );
  closeBtn.addEventListener("click", () => {
    route(LINKS.HOME.HREF);
  });
  closeBtn.innerHTML = "x";

  const passwordEye: any = container.querySelector(".password-eye");

  passwordEye.addEventListener("click", () => {
    if (inputPassword.type === "password") {
      inputPassword.type = "text";
      passwordEye.classList.add("active");
      setStatic(passwordEye, urlEyeSeePassword)
    } else {
      passwordEye.classList.remove("active");
      inputPassword.type = "password";
      passwordEye.classList.remove("active");
      setStatic(passwordEye, urlEyeNoSeePassword)
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
    authLogin(form, inputLogin, inputPassword, attempts);
  });

  submitButton.addEventListener("keydown", (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      attempts++;
      authLogin(form, inputLogin, inputPassword, attempts);
    }
  });
  form.addEventListener("input", (e: any) => {
    e.preventDefault();
    validateLoginForm(form, inputLogin, inputPassword);
  });

  removeItemLocalStorage(findUsername());
  return container;
}
