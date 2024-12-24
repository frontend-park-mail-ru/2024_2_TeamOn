import { LINKS, state } from "../../shared/consts/consts";
import {
  goToPage,
  pageContainer,
  urlHomeContainerSec,
  urlSignup,
} from "../../app/index";
import { ELEMENTS_CLASS } from "../../shared/consts/consts";
import { route } from "../../shared/routing/routing";
import { update } from "../../../lib/vdom/lib";
import { VNode } from "../../../lib/vdom/src/source";
import { containerSignup } from "./ui/signup";
import { authSignup } from "../../features/authSignup/authSignup";
import { validateSignupForm } from "../../shared/validateSignupForm/validateSignupForm";
import { setTitle } from "../../shared/settitle/setTitle";
import { setStatic } from "../../shared/getStatic/getStatic";
import { hideLoader, showLoader } from "../feed";
/**
 * Функция рендерит форму регистрации.
 * @returns
 */
export async function renderSignup() {
  try {
    showLoader();
    setTitle(LINKS.SIGNUP.TEXT);

    const vdom: VNode = containerSignup();

    const container = update(pageContainer, vdom);

    const signupContainer: any = container.querySelector(`.signup-background`);
    setStatic(signupContainer, urlHomeContainerSec);

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

    const closeBtn: any = container.querySelector(
      `.${ELEMENTS_CLASS.CLOSE_BTN.ELEMENT}`,
    );
    closeBtn.innerHTML = "x";

    closeBtn.onclick = () => {
      route(LINKS.HOME.HREF);
    };

    const loginLinkAnchor: any = container.querySelector(
      `.${ELEMENTS_CLASS.LOGIN_LINK.ELEMENT}`,
    );
    loginLinkAnchor.addEventListener("click", () => {
      goToPage((state.menuElements as { login: any }).login);
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
      validateSignupForm(
        form,
        inputUsername,
        inputPassword,
        inputRepeatPassword,
      );
    });
    return container;
  } catch (error) {
    console.error("Error in signup");
  } finally {
    hideLoader();
  }
}
