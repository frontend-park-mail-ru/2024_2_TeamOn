import { LINKS, QUERY } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";

/**
 * Функция получения популярных постов
 * @param offsetPopular Оффсет для популярных постов
 * @returns
 */
async function getModerationPosts(
  offsetApprove: number,
  filter: string,
  limit: number = 0,
) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      "/api/moderation/moderation/post" +
        `?limit=${limit === 0 ? QUERY.LIMIT : limit}&offset=${offsetApprove}&filter=${filter}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

export { getModerationPosts };
