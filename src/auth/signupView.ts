import { LINKS, state } from "../consts";
import { goToPage, pageContainer } from "../index";
import { authSignup, validateSignupForm } from "./signup";
import { ELEMENTS_CLASS } from "../consts";
import { route } from "../utils/routing";
import { createElement, createText, update } from "../lib/vdom/lib";
import { VNode } from "../lib/vdom/src/source";

/**
 * Функция рендерит форму регистрации.
 * @returns
 */
export function renderSignup() {
  const vdom: VNode = createElement("div", { class: "signup" }, [
    createElement("div", { class: ELEMENTS_CLASS.SIGNUP.ELEMENT }, [
      createElement("button", { class: ELEMENTS_CLASS.CLOSE_BTN.COMBINE }, []),
      createElement("h2", {}, [createText("Регистрация")]),
      createElement("form", { class: "form-signup" }, [
        createElement("input", { class: "input-username" }, []),
        createElement("input", { class: "input-password" }, []),
        createElement("input", { class: "input-repeatPassword" }, []),
        createElement("div", { class: "password-strength" }, []),
        createElement("input", { class: "button-signup" }, []),
      ]),
      createElement("div", { class: ELEMENTS_CLASS.LOGIN_LINK.BLOCK }, [
        createText("У вас уже есть аккаунт? "),
        createElement("a", { class: ELEMENTS_CLASS.LOGIN_LINK.COMBINE }, [
          createText("Войти"),
        ]),
      ]),
    ]),
  ]);
  const container = update(pageContainer, vdom);

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

<<<<<<< HEAD
  const closeBtn: any = container.querySelector(`.close-btn`);
=======
  const closeBtn: any = container.querySelector(
    `.${ELEMENTS_CLASS.CLOSE_BTN.ELEMENT}`,
  );
>>>>>>> 9d42475ac93784d07320ccdb38ff5a0f802b4773
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
    validateSignupForm(form, inputUsername, inputPassword, inputRepeatPassword);
  });
}

export function updatePasswordStrengthBar(strength: number) {
  const strengthBar: any = document.querySelector(".password-strength");
  const strengthPercentage = (strength / 5) * 100; // 5 - максимальное количество критериев

  // Установка ширины и цвета в зависимости от силы пароля
  strengthBar.style.width = strengthPercentage + "%";
  if (strengthPercentage == 0) {
    strengthBar.style.width = "10%";
  }
  // Изменение цвета в зависимости от силы пароля
  if (strengthPercentage <= 40) {
    strengthBar.style.backgroundColor = "red";
  } else if (strengthPercentage < 80) {
    strengthBar.style.backgroundColor = "yellow";
  } else {
    strengthBar.style.backgroundColor = "green";
  }
}
