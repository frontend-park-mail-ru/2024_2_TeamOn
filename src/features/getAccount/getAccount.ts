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
          const wdata = {
            authorUsername: "author_5",
            followers: 5,
            info: "Страница самого крутого автора - author_5",
            isSubscribe: false,
            subscriptions: [],
          };
          resolve(wdata);
        } else {
          const name = findUsername();
          removeItemLocalStorage(name);
          route(LINKS.HOME.HREF);
          const wdata = {
            authorUsername: "author_5",
            followers: 5,
            info: "Страница самого крутого автора - author_5",
            isSubscribe: false,
            subscriptions: [],
          };
          resolve(wdata);
        }
      },
    );
  });
}

export { getAccount };
