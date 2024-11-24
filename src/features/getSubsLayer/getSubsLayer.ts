import { fetchAjax } from "../../shared/fetch/fetchAjax";

/**
 * Функция получения оставшихся уровней подписки
 * @param offsetPopular Оффсет для популярных постов
 * @returns
 */
async function getSubsLayer() {
  return new Promise((resolve, reject) => {
    fetchAjax("GET", `/api/tech/subscription/layers`, null, (response) => {
      if (response.ok) {
        response.json().then((data) => {
          resolve(data);
        });
      } else if (response.status === 400) {
        reject(new Error("getCustomSubscription: 400 "));
      } else {
        reject(new Error("Внутреняя ошибка сервера"));
      }
    });
  });
}

export { getSubsLayer };
