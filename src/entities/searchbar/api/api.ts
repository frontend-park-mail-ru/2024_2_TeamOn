import { LINKS } from "../../../shared/consts/consts";
import { fetchAjax } from "../../../shared/fetch/fetchAjax";
import { route } from "../../../shared/routing/routing";

/**
 * Функция поиска авторов
 * @param authorName Автор
 * @returns
 */
async function searchAuthor(authorName: string) {
  return new Promise((resolve, reject) => {
    fetchAjax("GET", `/api/tech/search/${authorName}`, null, (response) => {
      if (response.ok) {
        response.json().then((data) => {
          resolve(data);
        });
      } else if (response.status === 400) {
        route(LINKS.ERROR.HREF);
      } else if (response.status === 500) {
        reject(new Error("Внутренняя ошибка сервера"));
      } else {
        reject(new Error("Ответ от фетча с ошибкой"));
      }
    });
  });
}

export { searchAuthor };
