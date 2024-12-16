import { LINKS } from "../../../shared/consts/consts";
import { route } from "../../../shared/routing/routing";
import DOMPurify from "dompurify";
import { addUserPost, deletePost } from "../../../entities/userPost";
import { getUserPosts } from "../../../features/getuserposts/getUserPosts";
import { uploadMediaFiles } from "../../../features/uploadMediaFiles/uploadMediaFiles";
import { controlSlideShow } from "../../../features/paginateFeed/paginateFeed";

async function modifireCreatePost() {
  const containerCreatePost: any = document.querySelector(
    ".container-createpost",
  );
  const buttonSave = containerCreatePost.querySelector(`.save-button`);
  const buttonCancel = containerCreatePost.querySelector(`.cancel-button`);
  const previewContainer: any = containerCreatePost.querySelector(
    `.container-image-photos`,
  ); // Контейнер для предпросмотра изображений
  const title: any = containerCreatePost.querySelector(`.input-group`);
  const content: any = containerCreatePost.querySelector(`.textarea-group`);

  title.addEventListener("input", () => {
    let input = containerCreatePost.querySelectorAll(`.form-group-add`)[1];
    let error = input.querySelector("p");
    if (error) {
      error.remove();
    }
  });
  content.addEventListener("input", () => {
    let input = containerCreatePost.querySelectorAll(`.form-group-add`)[1];
    let error = input.querySelector("p");
    if (error) {
      error.remove();
    }
  });
  if (buttonCancel) {
    buttonCancel.addEventListener("click", () => {
      route(LINKS.PROFILE.HREF);
    });
  }
  let layer = 0;
  const radioButtons = containerCreatePost.querySelectorAll(
    `input[name="visibility"]`,
  );
  radioButtons.forEach((radio: any) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        layer = radio.id;
      }
    });
    if (radio.checked) {
      layer = radio.id;
    }
  });
  if (buttonSave) {
    buttonSave.addEventListener("click", async (event: any) => {
      event.preventDefault();

      if (title.value == "" || content.value == "") {
        const input =
          containerCreatePost.querySelectorAll(`.form-group-add`)[1];
        const error = input.querySelector("p");
        if (!error) {
          const error = document.createElement("p");
          error.style.color = "red";
          error.textContent = "Ошибка. Поля не могут быть пустыми";
          input.appendChild(error);
        }
        return;
      }

      let input = containerCreatePost.querySelectorAll(`.form-group-add`)[1];
      let error = input.querySelector("p");
      if (error) {
        error.remove();
      }
      const sanitizedTitle = DOMPurify.sanitize(title.value);
      const sanitizedContent = DOMPurify.sanitize(content.value);
      try {
        const post: any = await addUserPost(
          containerCreatePost,
          sanitizedTitle,
          sanitizedContent,
          Number(layer),
        );
        let postId: any = await getUserPosts("/profile", 0, 300);
        postId = postId[0].postId;

        try {
          if (selectedFiles.length != 0) {
            const ok: any = await uploadMediaFiles(postId, selectedFiles);

            if (!ok) {
              const response: any = await deletePost(postId);

              const input =
                containerCreatePost.querySelectorAll(`.form-group-add`)[1];
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
            containerCreatePost.querySelectorAll(`.form-group-add`)[2];
          const error = input.querySelector("p");
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

  const mediaForm: any = containerCreatePost.querySelector(`.form-add-media`);
  mediaForm.enctype = "multipart/form-data";
  mediaForm.method = "POST";

  const buttonUploadMedia: any =
    containerCreatePost.querySelector(`.media-upload-label`);
  const mediaInput: any =
    containerCreatePost.querySelector(`.media-upload-input`);
  let selectedFiles: File[] = []; // Массив для хранения выбранных файлов
  const attacheInfo: any = buttonUploadMedia.querySelector(`.attache-info`);
  mediaInput.addEventListener("change", (event: any) => {
    const files: any = event.target.files;
    if (files && files.length) {
      const newFiles = Array.from(files);
      const voiceFiles: any = []; // Массив для голосовых файлов
      const videoFiles: any = []; // Массив для видеофайлов

      // Обработка файлов
      newFiles.forEach((file: any) => {
        if (file.type.startsWith("audio/")) {
          voiceFiles.push(file); // Добавляем в массив голосовых файлов
        } else if (file.type.startsWith("image/")) {
          videoFiles.push(file);
        } else {
          videoFiles.push(file);
        }
      });

      // Объединяем массивы: сначала видеофайлы, затем голосовые
      selectedFiles = [...videoFiles, ...voiceFiles];

      // Отображение превью для всех выбранных файлов
      let loadedFilesCount = 0;
      selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const fileDiv = createFileDiv(e.target.result, file.type, index);
          previewContainer.appendChild(fileDiv);
          loadedFilesCount++;

          if (loadedFilesCount === selectedFiles.length) {
            controlSlideShow(containerCreatePost, containerCreatePost);
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
      previewContainer.removeChild(fileDiv);
    });

    return removeButton;
  }

  attacheInfo.addEventListener("click", (e: any) => {
    mediaInput.click(); // Программно вызываем клик на input
    let input = containerCreatePost.querySelectorAll(`.form-group-add`)[1];
    let error = input.querySelector("p");
    if (error) {
      error.remove();
    }
  });
  const formats = containerCreatePost.querySelectorAll(`.format`);
  formats.forEach((format: any) => {
    format.addEventListener("click", () => {
      mediaInput.setAttribute("accept", "." + format.textContent);
      mediaInput.click(); // Программно вызываем клик на input
      let input = containerCreatePost.querySelectorAll(`.form-group-add`)[1];
      let error = input.querySelector("p");
      if (error) {
        error.remove();
      }
    });
  });
}

export { modifireCreatePost };
