import { fetchAjax } from "../../shared/fetch/fetchAjax";

/**
 * Функция получения популярных постов
 * @param offsetPopular Оффсет для популярных постов
 * @returns
 */
async function getCustomSubscription(link: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      link === "/profile"
        ? `/api/tech/subscription/me/custom`
        : `/api/tech/subscription/${sessionStorage.getItem("authorid")}/custom`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          reject(new Error("getCustomSubscription: 400 "));
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}


export { getCustomSubscription };
