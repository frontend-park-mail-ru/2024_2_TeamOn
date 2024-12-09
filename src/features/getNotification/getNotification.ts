import { LINKS, LOCATIONS, QUERY } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";

/**
 * Функция получения популярных постов
 * @param offsetPopular Оффсет для уведомлений
 * @returns
 */
async function getNotification(offsetNotifications = 0, status = "") {
  let queryParams = `limit=${QUERY.LIMIT}&offset=${offsetNotifications}`;
  if (status) {
    queryParams += `&status=${status}`;
  }
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.NOTIFICATION.GET_NOTIFICATION.HREF,
      `${LOCATIONS.NOTIFICATION.GET_NOTIFICATION.METHOD}?${queryParams}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Внутренняя ошибка сервера"));
        }
      },
    );
  });
}

export { getNotification };
