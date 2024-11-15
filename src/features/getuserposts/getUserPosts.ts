import { QUERY } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";

/**
 * Получаем посты пользователя через объект типа промис
 * @param link Ссылка на страницу
 * @param offset Оффсет
 * @param limit Лимит
 * @returns
 */
export async function getUserPosts(
  link: string,
  offset: number,
  limit: any = null,
) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      link === "/profile"
        ? `/api/posts/author/post/me?limit=${limit === null ? QUERY.LIMIT : limit}&offset=${offset}`
        : `/api/posts/author/post/${sessionStorage.getItem("authorid")}?limit=${limit === null ? QUERY.LIMIT : limit}&offset=${offset}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 404) {
          reject("Пост не найден");
        } else if (response.status === 504) {
          reject("Сервер не ответил вовремя. Попробуйте позже.");
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
