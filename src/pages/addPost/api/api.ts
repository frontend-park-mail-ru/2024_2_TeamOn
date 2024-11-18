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


/**
 * Добавляем пост через объект типа промис
 * @param containerCreatePost Контейнер добавления
 * @param title Заголовок
 * @param content Содержание
 * @returns
 */
async function addUserPost(
  containerCreatePost: any,
  title: string,
  content: string,
) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      "/api/posts/post",
      { title: title, content: content },
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          response.json().then((data) => {
            const input = containerCreatePost.querySelector(`.form-group`);
            const error = input.querySelector("p");
            if (!error) {
              const error = document.createElement("p");
              error.style.color = "red";
              error.textContent = data.message;
              input.appendChild(error);
            }
          });
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
export { addUserPost, editPost};
