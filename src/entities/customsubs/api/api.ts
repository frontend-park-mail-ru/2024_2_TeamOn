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
          resolve(true);
        } else if (response.status === 400) {
          response.json().then((data: any) => {
            resolve(data);
          });
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

/**
 * Функция добавления кастомных подписок
 * @param offsetPopular Оффсет для популярных постов
 * @returns
 */
async function requestPay(authorId: string, monthCount: number, layer: number) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/pages/subscription/request`,
      { authorId: authorId, monthCount: monthCount, layer: layer },
      (response) => {
        if (response.ok) {
          response.json().then((data: any) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          reject(new Error("getCustomSubscription: 400 "));
        } else {
          // reject(new Error("Внутреняя ошибка сервера"));
          resolve(true);
        }
      },
    );
  });
}

/**
 * Функция добавления кастомных подписок
 * @param offsetPopular Оффсет для популярных постов
 * @returns
 */
async function realizePay(subscriptionRequestID: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/pages/subscription/realize`,
      { subscriptionRequestID: subscriptionRequestID },
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 400) {
          reject(new Error("getCustomSubscription: 400 "));
        } else {
          // reject(new Error("Внутреняя ошибка сервера"));
          response.json().then((data: any) => {
            resolve(data);
          });
        }
      },
    );
  });
}

/**
 * Функция добавления кастомных подписок
 * @param offsetPopular Оффсет для популярных постов
 * @returns
 */
async function unfollow(authorId: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/danya/unsubscription`,
      { authorId: authorId },
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 400) {
          response.json().then((data: any) => {
            resolve(data);
          });
        } else {
          resolve(null);
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

export { addCustomSubs, requestPay, realizePay, unfollow };
