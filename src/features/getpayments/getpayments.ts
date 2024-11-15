import { LINKS } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";

/**
 * Получение выплат через объект типа промис
 * @param link Ссылка на страницу
 * @returns
 */
async function getPayments(link: string) {
  return new Promise((resolve, reject) => {
    if (link !== "/profile") {
      resolve(false);
    }
    fetchAjax("GET", "/api/danya/author/payments", null, (response) => {
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
    });
  });
}

export { getPayments };
