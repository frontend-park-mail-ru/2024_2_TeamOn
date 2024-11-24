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
// return new Promise((resolve, reject) => {
//   const subscriptions = [
//     {
//       customSubscriptionID: "sub_001",
//       title: "Subscription 1",
//       description: "Description for subscription 1",
//       cost: 10,
//       layer: 1,
//     },
//     {
//       customSubscriptionID: "sub_001",
//       title: "Subscription 1",
//       description: "Description for subscription 1",
//       cost: 10,
//       layer: 1,
//     },

// {
//   customSubscriptionID: "sub_002",
//   title: "Subscription 2",
//   description: "Description for subscription 2",
//   cost: 20,
//   layer: 2
// },
// {
//   customSubscriptionID: "sub_003",
//   title: "Subscription 3",
//   description: "Description for subscription 3",
//   cost: 30,
//   layer: 3
// }
// ];

// Возвращаем данные
//     resolve(subscriptions);
//   });
// }

export { getCustomSubscription };
