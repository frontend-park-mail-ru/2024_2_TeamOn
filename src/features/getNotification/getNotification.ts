import { LINKS, LOCATIONS, QUERY } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";

/**
 * Функция получения популярных постов
 * @param offsetPopular Оффсет для уведомлений
 * @returns
 */
async function getNotification(offset: any, status: string = "") {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      `/api/accounts/notification?offset=${offset}&limit=${QUERY.LIMIT}${status === "" ? "" : "&status=NOTREAD"}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          reject(new Error("Внутренняя ошибка сервера"));
        }
      },
    );
  });
}

/**
 * Функция получения популярных постов
 * @param offsetPopular Оффсет для уведомлений
 * @returns
 */
async function getPushNotification() {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      `/api/accounts/notification/new?time=10`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          reject(new Error("Внутренняя ошибка сервера"));
        }
      },
    );
  });
}

export { getNotification, getPushNotification };
