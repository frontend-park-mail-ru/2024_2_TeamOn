import { route } from "../../../shared/routing/routing";
import { fetchAjax } from "../../../shared/fetch/fetchAjax";
import { LINKS } from "../../../shared/consts/consts";

/**
 * Получение фона на странице автора через объект типа промис
 * @param link Ссылка на страницу
 * @param authorID Автор айди
 * @returns
 */
async function getBackgroundAuthor(link: string, authorID: any) {
    return new Promise((resolve, reject) => {
      fetchAjax(
        "GET",
        link == "/profile"
          ? "/api/danya/author/me/background"
          : `/api/danya/author/${authorID}/background`,
        null,
        (response) => {
          if (response.ok) {
            response.blob().then((blob) => {
              const url = URL.createObjectURL(blob);
              resolve(url);
            });
          } else if (response.status === 500) {
            resolve("https://cdn1.ozone.ru/s3/multimedia-p/6062969785.jpg");
          } else {
            reject(new Error("Ответ от фетча с ошибкой"));
          }
        },
      );
    });
  }

  /**
 * Сохранения бекграунда после загрузки
 * @param background Файл картинка
 * @returns
 */
async function saveBackground(background: FormData) {
    return new Promise((resolve, reject) => {
      fetchAjax(
        "POST",
        "/api/danya/author/update/background",
        background,
        (response) => {
          if (response.ok) {
            resolve(true);
          } else if (response.status === 401) {
            route(LINKS.ERROR.HREF);
          } else {
            reject(new Error("Внутреняя ошибка сервера"));
          }
        },
      );
    });
  }

  export { getBackgroundAuthor, saveBackground }