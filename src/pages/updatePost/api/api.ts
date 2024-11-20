import { route } from "../../../shared/routing/routing";
import { fetchAjax } from "../../../shared/fetch/fetchAjax";
import { LINKS } from "../../../shared/consts/consts";

/**
 * Функция изменения поста через объект типа промис
 * @param modalEdit Модальное окно редактирования
 * @param postIdEdit Айди редактируемого поста
 * @param titleEdit Заголовок редактирования
 * @param contentEdit Контент редактирования
 * @returns
 */
async function editPost(
  modalEdit: any,
  postIdEdit: any,
  titleEdit: any,
  contentEdit: any,
) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/posts/post/update`,
      {
        postId: postIdEdit,
        title: titleEdit,
        content: contentEdit,
      },
      (response) => {
        if (response.ok) {
          resolve(false);
        } else if (response.status === 400) {
          response.json().then((data: any) => {
            const input = modalEdit.querySelector(`.form-group`);
            const error = document.createElement("p");
            error.style.color = "red";
            error.textContent = data.message;
            input.appendChild(error);
          });
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}

export { editPost };
