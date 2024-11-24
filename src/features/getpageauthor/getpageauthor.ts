import { LINKS } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";

/**
 * Получение текущей страницы профиля через объект типа промис
 * @returns Информация о пользователе
 */
async function getPageAuthor(link: string, authorId: any = null) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      link === "/profile"
        ? "/api/danya/author/me"
        : !authorId
          ? `/api/danya/author/${sessionStorage.getItem("authorid")}`
          : `/api/danya/author/${authorId}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
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

export { getPageAuthor };
