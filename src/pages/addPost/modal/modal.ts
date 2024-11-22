import { LINKS } from "../../../shared/consts/consts";
import { route } from "../../../shared/routing/routing";
import DOMPurify from "dompurify";
import { addUserPost } from "../../../entities/userPost";
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
    alert(layer)
  });
  alert(layer)
  if (buttonSave) {
    buttonSave.addEventListener("click", async (event: any) => {
      event.preventDefault();
      const title: any = containerCreatePost.querySelector(`.input-group`);
      const content: any = containerCreatePost.querySelector(`.textarea-group`);
      const sanitizedTitle = DOMPurify.sanitize(title.value);
      const sanitizedContent = DOMPurify.sanitize(content.value);
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

  const mediaForm: any = containerCreatePost.querySelector(`.form-add-media`);
  mediaForm.enctype = "multipart/form-data";
  mediaForm.method = "POST";

  const buttonUploadMedia: any =
    containerCreatePost.querySelector(`.media-upload-label`);
  const mediaInput: any =
    containerCreatePost.querySelector(`.media-upload-input`);

  let selectedFiles: File[] = []; // Массив для хранения выбранных файлов

  mediaInput.addEventListener("change", (event: any) => {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length) {
      const newFiles = Array.from(files);
      selectedFiles.push(...newFiles); // Преобразуем FileList в массив
      previewContainer.innerHTML = ""; // Очищаем контейнер перед добавлением новых изображений
      let loadedFilesCount = 0;

      selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const fileDiv = createFileDiv(e.target?.result as string, index);
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

  // function createFileDiv(src: string, index: number): HTMLDivElement {
  //   const fileDiv = document.createElement("div");
  //   fileDiv.className = "file-preview"; // Класс для стилизации
  //   fileDiv.style.display = "flex"; // Выравнивание элементов по горизонтали
  //   fileDiv.style.alignItems = "center"; // Центрирование по вертикали
  //   fileDiv.style.margin = "10px"; // Отступ между элементами
  //   fileDiv.style.border = "1px solid #ccc"; // Рамка для div
  //   fileDiv.style.borderRadius = "5px"; // Закругление углов
  //   fileDiv.style.padding = "5px"; // Отступ внутри div

  //   const img = document.createElement("img");
  //   img.src = src;
  //   img.className = "image-photo";
  //   img.style.width = "100px"; // Устанавливаем ширину изображения
  //   img.style.marginRight = "10px"; // Отступ между изображением и кнопкой

  //   const removeButton = createRemoveButton(index, fileDiv);

  //   fileDiv.appendChild(img);
  //   fileDiv.appendChild(removeButton);

  //   return fileDiv;
  // }

  // function createRemoveButton(index: number, fileDiv: HTMLDivElement): HTMLButtonElement {
  //   const removeButton = document.createElement("button");
  //   removeButton.textContent = "Удалить";
  //   removeButton.style.marginLeft = "5px";
  //   removeButton.style.padding = "5px 10px"; // Отступы для кнопки
  //   removeButton.style.border = "none"; // Убираем рамку
  //   removeButton.style.backgroundColor = "#ff4d4d"; // Цвет фона кнопки
  //   removeButton.style.color = "white"; // Цвет текста
  //   removeButton.style.cursor = "pointer"; // Курсор при наведении
  //   removeButton.style.borderRadius = "3px"; // Закругление углов кнопки

  //   // Обработчик для удаления изображения
  //   removeButton.addEventListener("click", () => {
  //       selectedFiles.splice(index, 1); // Удаляем файл из массива
  //       previewContainer.removeChild(fileDiv); // Удаляем div с изображением и кнопкой

  //       // Обновляем индексы для кнопок удаления
  //       updateRemoveButtonIndices();
  //   });

  //   return removeButton;
  // }

  // function updateRemoveButtonIndices() {
  //   const filePreviews = previewContainer.getElementsByClassName("file-preview");
  //   for (let i = 0; i < filePreviews.length; i++) {
  //       const removeButton = filePreviews[i].querySelector("button");
  //       if (removeButton) {
  //           removeButton.removeEventListener("click", removeButtonClickHandler);
  //           removeButton.addEventListener("click", () => removeButtonClickHandler(i, filePreviews[i]));
  //       }
  //   }
  // }

  // function removeButtonClickHandler(index: number, fileDiv: HTMLDivElement) {
  //   selectedFiles.splice(index, 1); // Удаляем файл из массива
  //   previewContainer.removeChild(fileDiv); // Удаляем div с изображением и кнопкой
  //   updateRemoveButtonIndices(); // Обновляем индексы для кнопок удаления
  // }
  function createFileDiv(src: string, index: number): HTMLDivElement {
    const fileDiv = document.createElement("div");
    fileDiv.className = "file-preview"; // Класс для стилизации
    fileDiv.style.display = "flex"; // Выравнивание элементов по горизонтали
    fileDiv.style.alignItems = "center"; // Центрирование по вертикали
    fileDiv.style.margin = "10px"; // Отступ между элементами
    fileDiv.style.border = "1px solid #ccc"; // Рамка для div
    fileDiv.style.borderRadius = "5px"; // Закругление углов
    fileDiv.style.padding = "5px"; // Отступ внутри div

    const img = document.createElement("img");
    img.src = src;
    img.className = "image-photo";
    img.style.width = "100px"; // Устанавливаем ширину изображения
    img.style.marginRight = "10px"; // Отступ между изображением и кнопкой

    const removeButton = createRemoveButton(index, fileDiv);

    fileDiv.appendChild(img);
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
    removeButton.style.padding = "5px 10px"; // Отступы для кнопки
    removeButton.style.border = "none"; // Убираем рамку
    removeButton.style.backgroundColor = "#ff4d4d"; // Цвет фона кнопки
    removeButton.style.color = "white"; // Цвет текста
    removeButton.style.cursor = "pointer"; // Курсор при наведении
    removeButton.style.borderRadius = "3px"; // Закругление углов кнопки

    // Обработчик для удаления изображения
    removeButton.addEventListener("click", () => {
      selectedFiles.splice(index, 1); // Удаляем файл из массива
      previewContainer.removeChild(fileDiv); // Удаляем div с изображением и кнопкой
    });

    return removeButton;
  }

  buttonUploadMedia.addEventListener("click", () => {
    mediaInput.click(); // Программно вызываем клик на input
  });
}

const mediaChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];
  const mediaContainer = document.getElementById(
    "mediaContainer",
  ) as HTMLElement;

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileType = file.type;
      let mediaElement:
        | HTMLImageElement
        | HTMLVideoElement
        | HTMLAudioElement
        | HTMLIFrameElement
        | HTMLElement;

      // Обработка фото
      if (fileType.startsWith("image/")) {
        mediaElement = document.createElement("img") as HTMLImageElement;
        (mediaElement as HTMLImageElement).src = reader.result as string;
        (mediaElement as HTMLImageElement).style.maxWidth = "100%";

        // Обработка видео
      } else if (fileType.startsWith("video/")) {
        mediaElement = document.createElement("video") as HTMLVideoElement;
        (mediaElement as HTMLVideoElement).src = reader.result as string;
        (mediaElement as HTMLVideoElement).controls = true;
        (mediaElement as HTMLVideoElement).style.maxWidth = "100%";

        // Обработка аудио
      } else if (fileType.startsWith("audio/")) {
        mediaElement = document.createElement("audio") as HTMLAudioElement;
        (mediaElement as HTMLAudioElement).src = reader.result as string;
        (mediaElement as HTMLAudioElement).controls = true;
        (mediaElement as HTMLAudioElement).style.maxWidth = "100%";

        // Обработка PDF
      } else if (fileType === "application/pdf") {
        mediaElement = document.createElement("iframe") as HTMLIFrameElement;
        (mediaElement as HTMLIFrameElement).src = reader.result as string;
        (mediaElement as HTMLIFrameElement).style.width = "100%";
        (mediaElement as HTMLIFrameElement).style.height = "500px";
      } else {
        mediaElement = document.createElement("div") as HTMLElement;
        mediaElement.textContent = "Неподдерживаемый тип файла";
      }
      mediaContainer.innerHTML = "";
      mediaContainer.appendChild(mediaElement);
    };
    reader.readAsDataURL(file);
  }
};

export { modifireCreatePost };
