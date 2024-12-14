import { controlPush } from "../../shared/push/push";
import { pageContainer } from "../../app";
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
      link === "/profile" && !authorId
        ? "/api/pages/author/me"
        : !authorId
          ? `/api/pages/author/${sessionStorage.getItem("authorid") ? sessionStorage.getItem("authorid") : link.split("/").pop()}`
          : `/api/pages/author/${authorId ? authorId : link.split("/").pop()}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          const message = "У пользователя нет своей страницы";
          controlPush({ status: false, message: message }, "isnotpush");
        } else {
          fetch("/error.html")
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.text();
            })
            .then((data) => {
              pageContainer.innerHTML = data;
            })
            .catch((error) => {
              console.error(error);
            });
          // route(LINKS.ERROR.HREF)
          // reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}

export { getPageAuthor };
