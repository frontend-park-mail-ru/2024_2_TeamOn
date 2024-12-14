import { LINKS } from "../../../shared/consts/consts";
import { fetchAjax } from "../../../shared/fetch/fetchAjax";
import { route } from "../../../shared/routing/routing";

/**
 * Функция отправки пожертвования
 * @param authorId
 * @param body
 * @returns
 */
async function sendTip(authorId: any, body: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/pages/author/${authorId}/tip`,
      { message: body.sanitizedMessage, cost: Number(body.cost) },
      (response) => {
        if (response.ok) {
          response.json().then((data: any) => {
            resolve(data)
          })
        } else if (response.status === 401) {
          localStorage.clear();
          route(LINKS.HOME.HREF);
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}

export { sendTip };
