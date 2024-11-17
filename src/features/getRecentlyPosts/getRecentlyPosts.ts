import { LINKS, LOCATIONS, QUERY } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";

/**
 * Функция получения недавних постов
 * @param offsetRecently Оффсет для недавних
 * @returns
 */
async function getRecentlyPosts(offsetRecently: number) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.POSTS.RECENTLY_POSTS.METHOD,
      LOCATIONS.POSTS.RECENTLY_POSTS.HREF +
        `?limit=${QUERY.LIMIT}&offset=${offsetRecently}`,
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

export { getRecentlyPosts };
