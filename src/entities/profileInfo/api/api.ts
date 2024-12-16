import { LINKS } from "../../../shared/consts/consts";
import { fetchAjax } from "../../../shared/fetch/fetchAjax";
import { route } from "../../../shared/routing/routing";

/**
 * Функция подписки
 * @param authorId Автор айди
 * @returns
 */
async function following(authorId: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/pages/author/${authorId}/following`,
      null,
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 400) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}

export { following };
