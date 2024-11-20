import { LINKS } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";

/**
 * Функция выдачи медиа-контента
 * @param offsetRecently Оффсет для недавних
 * @returns
 */
async function getUrlFiles(postId: number) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      "/api/posts/post/media/" + `${postId}`,
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

export { getUrlFiles };
