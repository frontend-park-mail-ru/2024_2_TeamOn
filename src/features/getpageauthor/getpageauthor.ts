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
            // const wdata = { authorUsername: "author_5",
            //   followers
            //   : 
            //   5,
            //   info
            //   : 
            //   "Страница самого крутого автора - author_5",
            //   isSubscribe
            //   : 
            //   false,
            //   subscriptions
            //   : 
            //   []};
            // resolve(wdata);
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
            // const wdata = { authorUsername: "author_5",
            //   followers
            //   : 
            //   5,
            //   info
            //   : 
            //   "Страница самого крутого автора - author_5",
            //   isSubscribe
            //   : 
            //   false,
            //   subscriptions
            //   : 
            //   []};
            // resolve(wdata);
        }
      },
    );
  });
}

export { getPageAuthor };
