import { LINKS } from "../../shared/consts/consts";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";

/**
 * Функция загрузки медиа-контента
 * @param offsetRecently Оффсет для недавних
 * @returns
 */
async function uploadMediaFiles(postId: number, files: File[]) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    files.forEach((file: any, index: number) => {
      formData.append(`file${index + 1}`, file); // Используем "files[]" для отправки массива файлов
    });

    fetchAjax(
      "POST",
      "/api/posts/post/upload/media/" + `${postId}`,
      formData, // Передаем formData напрямую
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          resolve(false);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

export { uploadMediaFiles };
