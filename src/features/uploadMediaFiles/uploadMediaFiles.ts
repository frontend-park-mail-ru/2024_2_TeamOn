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
      formData.append(`file${index + 1}`, file);
    });

    // Создаем объект для отслеживания статуса
    const uploadStatus = { pending: true };

    fetchAjax(
      "POST",
      "/api/posts/post/upload/media/" + `${postId}`,
      formData,
      (response) => {
        uploadStatus.pending = false; // Изменяем статус на "не в ожидании"
        if (response.ok) {
          resolve({ success: true, pending: false });
        } else if (response.status === 400) {
          resolve({ success: false, pending: false });
        } else {
          reject(new Error("Внутренняя ошибка сервера"));
        }
      },
    );

    // Возвращаем статус загрузки
    resolve(uploadStatus);
  });
}
// async function uploadMediaFiles(postId: number, files: File[]) {
//   return new Promise((resolve, reject) => {
//     const formData = new FormData();
//     files.forEach((file: any, index: number) => {
//       formData.append(`file${index + 1}`, file); // Используем "files[]" для отправки массива файлов
//     });

//     fetchAjax(
//       "POST",
//       "/api/posts/post/upload/media/" + `${postId}`,
//       formData, // Передаем formData напрямую
//       (response) => {
//         if (response.ok) {
//           resolve(true);
//         } else if (response.status === 400) {
//           resolve(false);
//         } else {
//           resolve(false);
//           // reject(new Error("Внутреняя ошибка сервера"));
//         }
//       },
//     );
//   });
// }

export { uploadMediaFiles };
