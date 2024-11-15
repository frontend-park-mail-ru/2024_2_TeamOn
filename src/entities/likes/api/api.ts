import { LINKS, LOCATIONS } from "../../../shared/consts/consts";
import { fetchAjax } from "../../../shared/fetch/fetchAjax";
import { route } from "../../../shared/routing/routing";

/**
 * Функция добавления лайка
 * @param postId
 * @returns
 */
async function AddLikeOnPost(postId: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.POSTS.LIKE.METHOD,
      LOCATIONS.POSTS.LIKE.HREF,
      { postId: postId },
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 404) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

export { AddLikeOnPost };
