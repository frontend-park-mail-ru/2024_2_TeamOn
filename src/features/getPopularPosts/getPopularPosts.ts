import { LINKS, LOCATIONS, QUERY } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";

/**
 * Функция получения популярных постов
 * @param offsetPopular Оффсет для популярных постов
 * @returns
 */
async function getPopularPosts(offsetPopular: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.POSTS.POPULAR_POSTS.METHOD,
      LOCATIONS.POSTS.POPULAR_POSTS.HREF +
        `?limit=${QUERY.LIMIT}&offset=${offsetPopular}`,
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

export { getPopularPosts };
