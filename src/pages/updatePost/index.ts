import { modifierSidebar } from "../../shared/sidebar/modifire";
import { renderTo, update } from "../../../lib/vdom/lib";
import {
  pageContainer,
  urlCloseModal,
  urlIconAttache,
  urlLeftArrowModal,
  urlRightArrowModal,
} from "../../app";
import { containerUpdatePost } from "./ui/ui";
import { route } from "../../shared/routing/routing";
import { allowedExtensions, LINKS, state } from "../../shared/consts/consts";
import DOMPurify from "dompurify";
import { deletePost, editPost } from "../../entities/userPost";
import { uploadMediaFiles } from "../../features/uploadMediaFiles/uploadMediaFiles";
import { containerMediaPost } from "../../widgest/feed/ui/post/post";
import { controlSlideShow } from "../../features/paginateFeed/paginateFeed";
import { deleteMediaInPost } from "./api/api";
import { setStatic } from "../../shared/getStatic/getStatic";
import { hideLoader, showLoader } from "../feed";

async function mofireUpdatePost() {
  const currentPost: any = state.currentPostId;
  const containerUpdatePost: any = document.querySelector(
    ".container-updatepost",
  );
  const previewContainer: any = containerUpdatePost.querySelector(
    `.container-image-photos`,
  );
  console.log(currentPost);
  const buttonSave = containerUpdatePost.querySelector(`.save-button`);
  const buttonCancel = containerUpdatePost.querySelector(`.cancel-button`);

  const title: any = containerUpdatePost.querySelector(`.input-group`);
  const content: any = containerUpdatePost.querySelector(`.textarea-group`);
  title.value = currentPost.title;
  content.textContent = currentPost.content;
  const saveFiles: any = [];

  const containerMedia: any = await containerMediaPost(currentPost.postId);
  if (containerMedia) {
    let arrayMedia: any = [];
    containerMedia[0].forEach(async (media: any, index: number) => {
      const divMedia = renderTo(media);
      console.log(media);
      const fileDiv = document.createElement("div");
      fileDiv.className = "file-preview";
      fileDiv.style.display = "flex";
      fileDiv.style.alignItems = "center";
      fileDiv.style.margin = "10px";
      fileDiv.style.border = "1px solid #ccc";
      fileDiv.style.borderRadius = "5px";
      fileDiv.style.padding = "5px";

      fileDiv.append(divMedia);
      const removeButton = document.createElement("button");
      removeButton.textContent = "Удалить";
      removeButton.style.marginLeft = "5px";
      removeButton.style.padding = "5px 10px";
      removeButton.style.border = "none";
      removeButton.style.backgroundColor = "#ff4d4d";
      removeButton.style.color = "white";
      removeButton.style.cursor = "pointer";
      removeButton.style.borderRadius = "3px";
      fileDiv.append(removeButton);
      removeButton.addEventListener("click", async () => {
        fileDiv.remove();
        saveFiles.push(containerMedia[1][index]);
        selectedFiles = selectedFiles.filter((file) => file !== media.file);
        allSendFiles = allSendFiles.filter((file: any) => file !== media.file);
      });

      arrayMedia.push(fileDiv);
    });
    const place: any = containerUpdatePost.querySelector(
      `.container-image-photos`,
    );
    place.append(...arrayMedia);
  }
  if (buttonCancel) {
    buttonCancel.addEventListener("click", () => {
      route(LINKS.PROFILE.HREF);
    });
  }

  if (buttonSave) {
    buttonSave.addEventListener("click", async (event: any) => {
      event.preventDefault();
      saveFiles.forEach(async (file: any) => {
        const response = await deleteMediaInPost(currentPost.postId, file);
      });
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
          if (allSendFiles.length != 0) {
            const ok: any = await uploadMediaFiles(
              currentPost.postId,
              allSendFiles,
            );
            if (!ok) {
              await deletePost(currentPost.postId);

              const input =
                containerUpdatePost.querySelectorAll(`.form-group-add`)[1];
              const error = input.querySelector("p");
              if (!error) {
                const error = document.createElement("p");
                error.style.color = "red";
                error.textContent = "Файлы слишком большие";
                input.appendChild(error);
              }
              return;
            }
          }
        } catch (error) {
          console.error("Ошибка при загрузке фонового изображения:", error);
        }

        if (post && !post.message) {
          route(LINKS.PROFILE.HREF);
        } else {
          const input =
            containerUpdatePost.querySelectorAll(`.form-group-add`)[1];
          const error = input.querySelector("p");
          alert(error);
          if (!error) {
            const error = document.createElement("p");
            error.style.color = "red";
            error.textContent = post.message;
            input.appendChild(error);
          }
          return;
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
  const attacheInfo: any = buttonUploadMedia.querySelector(`.attache-info`);

  let selectedFiles: File[] = []; // Массив для хранения выбранных файлов
  let allSendFiles: any = [];
  mediaInput.addEventListener("change", (event: any) => {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length) {
      const newFiles = Array.from(files);

      // Фильтруем валидные файлы
      const validFiles = newFiles.filter((file) => {
        const extension: any = file.name.split(".").pop()?.toLowerCase(); // Получаем расширение файла
        return allowedExtensions.includes(extension); // Проверяем, допустимо ли расширение
      });

      // Удаляем невалидные файлы из нового выбора
      const invalidFiles = newFiles.filter(
        (file) => !validFiles.includes(file),
      );

      let loadedFilesCount = 0;

      // Добавляем валидные файлы в массив selectedFiles, исключая дубликаты
      validFiles.forEach((file) => {
        if (!selectedFiles.includes(file)) {
          selectedFiles.push(file);
          allSendFiles.push(file)
        }
      });
      const voiceFiles: any = []; // Массив для голосовых файлов
      const videoFiles: any = []; // Массив для видеофайлов

      // Обработка файлов
      validFiles.forEach((file: any) => {
        if (file.type.startsWith("audio/")) {
          voiceFiles.push(file); // Добавляем в массив голосовых файлов
        } else if (file.type.startsWith("image/")) {
          videoFiles.push(file);
        } else {
          videoFiles.push(file);
        }
      });
      // Обработка недопустимых файлов
      if (invalidFiles.length > 0) {
        const input =
          containerUpdatePost.querySelectorAll(`.form-group-add`)[1];
        let error = input.querySelector("p");
        if (!error) {
          error = document.createElement("p");
          error.style.color = "red";
          input.appendChild(error);
        }
        error.textContent =
          "Ошибка. Неподдерживаемый формат файла: " +
          invalidFiles.map((file) => file.name).join(", ");
      }
      selectedFiles = [...videoFiles, ...voiceFiles];
      allSendFiles = [...allSendFiles, selectedFiles]
      // Отображаем превью для всех выбранных файлов
      selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const fileDiv = createFileDiv(e.target?.result as string, file.type, index);
          previewContainer.appendChild(fileDiv);
          loadedFilesCount++;

          if (loadedFilesCount === selectedFiles.length) {
            controlSlideShow(containerUpdatePost, containerUpdatePost);
          }
        };
        reader.readAsDataURL(file);
      });

    }
  });

  function createFileDiv(
    src: string,
    type: string,
    index: number,
  ): HTMLDivElement {
    const fileDiv = document.createElement("div");
    fileDiv.className = "file-preview";
    fileDiv.style.display = "flex";
    fileDiv.style.alignItems = "center";
    fileDiv.style.margin = "10px";
    fileDiv.style.border = "1px solid #ccc";
    fileDiv.style.borderRadius = "5px";
    fileDiv.style.padding = "5px";

    let mediaElement;
    // Определяем тип медиафайла и создаем соответствующий элемент
    if (type.startsWith("video/")) {
      mediaElement = document.createElement("video");
      mediaElement.src = src;
      mediaElement.controls = true;
      if (window.innerWidth > 768) {
        mediaElement.style.maxWidth = "400px";
      } else {
        mediaElement.style.maxWidth = "200px";
      }
    } else if (type.startsWith("audio/")) {
      mediaElement = document.createElement("audio");
      mediaElement.src = src;
      mediaElement.controls = true;
    } else {
      const img = document.createElement("img");
      img.src = src;
      img.className = "image-photo";
      if (window.innerWidth < 768) {
        img.style.maxWidth = "400px";
      } else {
        img.style.maxWidth = "200px";
      }
      fileDiv.appendChild(img);
    }

    if (mediaElement) {
      fileDiv.appendChild(mediaElement);
    }

    const removeButton = createRemoveButton(index, fileDiv);
    fileDiv.appendChild(removeButton);

    return fileDiv;
  }

  function createRemoveButton(
    index: number,
    fileDiv: HTMLDivElement,
  ): HTMLButtonElement {
    const removeButton = document.createElement("button");
    removeButton.textContent = "Удалить";
    removeButton.style.marginLeft = "5px";
    removeButton.style.padding = "5px 10px";
    removeButton.style.border = "none";
    removeButton.style.backgroundColor = "#ff4d4d";
    removeButton.style.color = "white";
    removeButton.style.cursor = "pointer";
    removeButton.style.borderRadius = "3px";

    // Обработчик для удаления изображения
    removeButton.addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      allSendFiles.splice(index,1);
      previewContainer.removeChild(fileDiv);
    });

    return removeButton;
  }

  attacheInfo.addEventListener("click", () => {
    mediaInput.click();
    let input = containerUpdatePost.querySelectorAll(`.form-group-add`)[1];
    let error = input.querySelector("p");
    if (error) {
      error.remove();
    }
  });
  const formats = containerUpdatePost.querySelectorAll(`.format`);
  formats.forEach((format: any) => {
    format.addEventListener("click", () => {
      mediaInput.setAttribute("accept", "." + format.textContent);
      mediaInput.click(); // Программно вызываем клик на input
      let input = containerUpdatePost.querySelectorAll(`.form-group-add`)[1];
      let error = input.querySelector("p");
      if (error) {
        error.remove();
      }
    });
  });
}

async function renderUpdatePost() {
  try {
    showLoader();
    const postId: any = state.currentPostId;
    if (!postId) route(LINKS.PROFILE.HREF);
    const vdom: any = await containerUpdatePost();
    const container: any = update(pageContainer, vdom);
    const mainContent = container.querySelector(".main-content");
    const iconAttache = container.querySelector(`.icon-attache`);
    setStatic(iconAttache, urlIconAttache);

    const closeModalView: any = container.querySelector(`.close-modal-view`);
    setStatic(closeModalView, urlCloseModal);
    const leftArrowModalView: any = container.querySelector(
      `.leftarrow-modal-view`,
    );
    setStatic(leftArrowModalView, urlLeftArrowModal);
    const rightArrowModalView: any = container.querySelector(
      `.rightarrow-modal-view `,
    );
    setStatic(rightArrowModalView, urlRightArrowModal);

    modifierSidebar(mainContent);

    await mofireUpdatePost();
    return container;
  } catch (error) {
    console.error("Error in updatepost");
  } finally {
    hideLoader();
  }
}

export { renderUpdatePost };
