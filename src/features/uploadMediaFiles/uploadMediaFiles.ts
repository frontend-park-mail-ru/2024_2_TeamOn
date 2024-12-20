import { fetchAjax } from "../../shared/fetch/fetchAjax";

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

    fetchAjax(
      "POST",
      "/api/posts/post/upload/media/" + `${postId}`,
      formData,
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 400) {
          resolve(false);
        } else {
          resolve(false);
        }
      },
    );
  });
}

export { uploadMediaFiles };
