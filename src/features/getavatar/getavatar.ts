import { fetchAjax } from "../../shared/fetch/fetchAjax";

/**
 * Функция получения аватара через объект типа промис
 * @param link Ссылка на страницу
 * @param authorID Автор айди
 * @returns
 */
export async function getAvatar(link: string, authorId: any = null) {

  return new Promise((resolve, reject) => {
    fetchAjax(
      // "GET",
      // link == "/profile" && !authorID
      //   ? "/api/accounts/account/me/avatar"
      //   : `/api/accounts/account/${authorID ? authorID : link.split("/").pop()}/avatar`,

        "GET",
        link === "/profile" && !authorId
          ? "/api/accounts/account/me/avatar"
          : !authorId
            ? `/api/accounts/account/${sessionStorage.getItem("authorid") ? sessionStorage.getItem("authorid") : link.split("/").pop()}/avatar`
            : `/api/accounts/account/${authorId ? authorId : link.split("/").pop()}/avatar`,
      null,
      (response) => {
        if (response.ok) {
          response.blob().then((blob) => {
            const url = URL.createObjectURL(blob);
            resolve(url);
          });
        } else if (response.status === 500) {
          resolve(
            "https://github.com/frontend-park-mail-ru/2024_2_TeamOn/blob/ts/src/styles/photos/avatar/default.jpg?raw=true",
          );
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}
