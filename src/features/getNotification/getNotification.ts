import { QUERY } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";

/**
 * Функция получения популярных постов
 * @param offsetPopular Оффсет для уведомлений
 * @returns
 */
async function getNotification(
  offset: any,
  status: string = "",
  customLimit: number = 0,
) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      `/api/accounts/notification?offset=${offset}&limit=${customLimit === 0 ? QUERY.LIMIT : customLimit}${status === "" ? "" : "&status=NOTREAD"}`,
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
          reject(new Error("Внутренняя ошибка сервера2"));
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
      `/api/accounts/notification/new?time=5`,
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
