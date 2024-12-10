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
async function addComment(
  place: any,
  postIdEdit: any,
  titleEdit: any,
  contentEdit: any,
) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/posts/post`,
      {
        postId: postIdEdit,
        title: titleEdit,
        content: contentEdit,
      },
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 400) {
          response.json().then((data) => {
            resolve(data);
            // let input =
            //   place.querySelector(`.form-group-add`);
            // const error = input.querySelector("p");
            // if (!error) {
            //   const error = document.createElement("p");
            //   error.style.color = "red";
            //   error.textContent = data.message;
            //   input.appendChild(error);
            // }
          });
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}

export { addComment };
