import { modifierSidebar } from "../../shared/sidebar/modifire";
import { update } from "../../../lib/vdom/lib";
import { pageContainer } from "../../app";
import { containerUpdatePost } from "./ui/ui";
import { route } from "../../shared/routing/routing";
import { LINKS, state } from "../../shared/consts/consts";
import DOMPurify from "dompurify";
import { addUserPost, editPost } from "../../entities/userPost";
import { uploadMediaFiles } from "../../features/uploadMediaFiles/uploadMediaFiles";
import { getUserPosts } from "../../features/getuserposts/getUserPosts";

async function mofireUpdatePost() {
  const currentPost: any = state.currentPostId;
  const containerUpdatePost: any = document.querySelector(
    ".container-updatepost",
  );
  const buttonSave = containerUpdatePost.querySelector(`.save-button`);
  const buttonCancel = containerUpdatePost.querySelector(`.cancel-button`);

  const title: any = containerUpdatePost.querySelector(`.input-group`);
  const content: any = containerUpdatePost.querySelector(`.textarea-group`);
  title.value = currentPost.title;
  content.textContent = currentPost.content;

  if (buttonCancel) {
    buttonCancel.addEventListener("click", () => {
      route(LINKS.PROFILE.HREF);
    });
  }

  if (buttonSave) {
    buttonSave.addEventListener("click", async (event: any) => {
      event.preventDefault();

      const sanitizedTitle = DOMPurify.sanitize(title.value);
      const sanitizedContent = DOMPurify.sanitize(content.value);

      if (title.value == "" || content.value == "") {
        const input =
          containerUpdatePost.querySelectorAll(`.form-group-add`)[1];
        const error = input.querySelector("p");
        if (!error) {
          const error = document.createElement("p");
          error.style.color = "red";
          error.textContent = "Ошибка. Поля не могут быть пустыми";
          input.appendChild(error);
        }
        return;
      }
      let input = containerUpdatePost.querySelectorAll(`.form-group-add`)[1];
      let error = input.querySelector("p");
      if (error) {
        error.remove();
      }
      try {
        if (!currentPost.postId) route(LINKS.PROFILE.HREF);
        const post: any = await editPost(
          containerUpdatePost,
          currentPost.postId,
          sanitizedTitle,
          sanitizedContent,
        );

        try {
          if (selectedFiles.length != 0) {
            const ok: any = await uploadMediaFiles(currentPost, selectedFiles);
          }
        } catch (error) {
          console.error("Ошибка при загрузке фонового изображения:", error);
        }

        if (post) {
          route(LINKS.PROFILE.HREF);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  const mediaForm: any = containerUpdatePost.querySelector(`.form-add-media`);
  mediaForm.enctype = "multipart/form-data";
  mediaForm.method = "POST";

  const buttonUploadMedia: any =
    containerUpdatePost.querySelector(`.media-upload-label`);
  const mediaInput: any =
    containerUpdatePost.querySelector(`.media-upload-input`);

  let selectedFiles: File[] = []; // Массив для хранения выбранных файлов

  mediaInput.addEventListener("change", (event: any) => {
    const files = event.target.files;

    if (files.length) {
      selectedFiles = Array.from(files); // Преобразуем FileList в массив
    }
  });

  buttonUploadMedia.addEventListener("click", () => {
    mediaInput.click(); // Программно вызываем клик на input
  });
}

async function renderUpdatePost() {
  try {
    const postId: any = state.currentPostId;
    if (!postId) route(LINKS.PROFILE.HREF);
    const vdom: any = await containerUpdatePost();
    const container: any = update(pageContainer, vdom);
    const mainContent = container.querySelector(".main-content");

    modifierSidebar(mainContent);

    await mofireUpdatePost();
    return container;
  } catch (error) {
    console.error("Error in updatepost");
  }
}

export { renderUpdatePost };
