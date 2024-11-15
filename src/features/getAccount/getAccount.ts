import { LINKS, LOCATIONS } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";
import { findUsername } from "../../shared/utils/hasLogged";
import { removeItemLocalStorage } from "../../shared/utils/storages";

/**
 * Функция получения аккаунта
 * @returns
 */
async function getAccount() {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.ACCOUNT.GET_ACCOUNT.METHOD,
      "/api/accounts/account",
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 401) {
          const name = findUsername();
          removeItemLocalStorage(name);
          route(LINKS.HOME.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

export { getAccount };
