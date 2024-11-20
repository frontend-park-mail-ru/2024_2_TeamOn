import { fetchAjax } from "../../../shared/fetch/fetchAjax";

/**
 * Функция добавления кастомных подписок
 * @param offsetPopular Оффсет для популярных постов
 * @returns
 */
async function addCustomSubs(
  title: string,
  description: string,
  cost: number,
  layer: number,
) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/tech/subscription/custom`,
      { title: title, description: description, cost: cost, layer: layer },
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

export { addCustomSubs };
