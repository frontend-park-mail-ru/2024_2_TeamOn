import { LINKS } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";

/**
 * Функция выдачи медиа-контента
 * @param offsetRecently Оффсет для недавних
 * @returns
 */
async function getMediaFiles(url: number) {
  return new Promise((resolve, reject) => {
    fetchAjax("GET", `/api/posts/${url}`, null, (response) => {
      if (response.ok) {
        response.blob().then((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        });
      } else if (response.status === 400) {
        route(LINKS.ERROR.HREF);
      } else {
        reject(new Error("Внутреняя ошибка сервера"));
      }
    });
  });
}

export { getMediaFiles };
