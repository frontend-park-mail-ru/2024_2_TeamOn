import { LINKS, LOCATIONS, sidebarLinks } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import {
  validateSignupForm,
  validationErrorSignupForm,
} from "../../shared/validateSignupForm/validateSignupForm";
import { addItemLocalStorage } from "../../shared/utils/storages";
import DOMPurify from "dompurify";
import { route } from "../../shared/routing/routing";

/**
 * Регистрирует нового пользователя, если форма регистрации корректна.
 * @param {*} form Форма регистрации
 * @param {*} username Поле ввода логина
 * @param {*} password Поле ввода пароля
 * @param {*} inputRepeatPassword Поле ввода повторного пароля
 */
export function authSignup(
  form: any,
  username: any,
  password: any,
  inputRepeatPassword: any,
) {
  if (!validateSignupForm(form, username, password, inputRepeatPassword)) {
    fetchAjax(
      LOCATIONS.AUTH.SIGNUP.METHOD,
      LOCATIONS.AUTH.SIGNUP.HREF,
      { username: username.value, password: password.value },
      (response) => {
        if (response.ok) {
          sidebarLinks[0].active = true;
          addItemLocalStorage(DOMPurify.sanitize(username.value));
          route(LINKS.FEED.HREF);
        } else if (response.status === 400) {
          response.json().then((data: any) => {
            validationErrorSignupForm(
              username,
              password,
              inputRepeatPassword,
              data.message,
            );
          });
        }
      },
    );
  }
}
