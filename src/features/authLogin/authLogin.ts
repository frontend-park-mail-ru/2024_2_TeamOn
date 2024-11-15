import { LINKS, LOCATIONS, sidebarLinks } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import {
  validateErrorLoginForm,
  validateLoginForm,
} from "../../shared/validateLoginForm/validateLoginForm";
import { addItemLocalStorage } from "../../shared/utils/storages";
import DOMPurify from "dompurify";
import { route } from "../../shared/routing/routing";

/**
 * Авторизирует нового пользователя, если форма авторизации корректна.
 * @param {*} form Форма авторизации
 * @param {*} username Поле ввода логина
 * @param {*} password Поле ввода пароля
 * @param {*} inputRepeatPassword Поле ввода повторного пароля
 */
export function authLogin(
  form: any,
  inputLogin: any,
  inputPassword: any,
  attempts: any,
) {
  if (!validateLoginForm(form, inputLogin, inputPassword)) {
    fetchAjax(
      LOCATIONS.AUTH.LOGIN.METHOD,
      LOCATIONS.AUTH.LOGIN.HREF,
      { username: inputLogin.value, password: inputPassword.value },
      (response) => {
        if (response.ok) {
          sidebarLinks[0].active = true;
          addItemLocalStorage(DOMPurify.sanitize(inputLogin.value));
          route(LINKS.FEED.HREF);
        } else if (response.status === 400) {
          validateErrorLoginForm(inputLogin, inputPassword, attempts);
        }
      },
    );
  }
}
