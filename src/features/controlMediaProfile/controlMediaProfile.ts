import { saveBackground } from "../../entities/profileDesktopHeader";
import { renderModalStatusUpload } from "../../shared/pushstatus/pushstatus";
import { controlSlideShow } from "../paginateFeed/paginateFeed";

/**
 * Загрузка бекграунда
 */
function handleImageUpload() {
  const button: any = document.querySelector(`.image-upload-label`);
  const profilePicInput: any = document.querySelector(`.image-upload-input`);
  const profilePic: any = document.querySelector(`.background-image`);

  // Добавляем обработчик события change к input
  profilePicInput.addEventListener("change", async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Обработчик события load
      reader.onload = async function (e: any) {
        profilePic.src = e.target.result;

        // Создаем FormData и добавляем файл
        const formData = new FormData();
        formData.append("file", file); // Добавляем файл в FormData

        // Отправляем данные на сервер
        try {
          const ok: any = await saveBackground(formData);
          const message = "Фон успешно применен";
          renderModalStatusUpload(ok, message);
        } catch (error) {
          console.error("Ошибка при загрузке фонового изображения:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  });

  // Добавляем обработчик события click к кнопке
  button.addEventListener("click", () => {
    profilePicInput.click(); // Программно вызываем клик на input
  });
}

/**
 * Загрузка бекграунда с мобильного приложения
 */
function handleImageUploadMobile() {
  const profilePicInput: any = document.querySelector(
    `.image-upload-input-mobile`,
  );
  const profilePic: any = document.querySelector(`.background-image-mobile`);

  // Добавляем обработчик события change к input
  profilePicInput.addEventListener("change", async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Обработчик события load
      reader.onload = async function (e: any) {
        profilePic.src = e.target.result;

        // Создаем FormData и добавляем файл
        const formData = new FormData();
        formData.append("file", file); // Добавляем файл в FormData

        // Отправляем данные на сервер
        try {
          const ok: any = await saveBackground(formData);
          const message = "Фон успешно применен";
          renderModalStatusUpload(ok, message);
        } catch (error) {
          console.error("Ошибка при загрузке фонового изображения:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  });

  const button: any = document.querySelector(`.change-cover-button-mobile`);
  const buttonUpload: any = document.getElementById("image-upload-mobile");
  button.addEventListener("click", () => {
    buttonUpload.click(); // Программно вызываем клик на input
  });
}

/**
 * Взаимодействие с бекграундом
 * @param container Контейнер профиля
 */
function controlMediaProfile(container: any) {
  if (window.location.pathname === "/profile") {
    window.innerWidth <= 1024 ? handleImageUploadMobile() : handleImageUpload();
    const background = container.querySelector(".header-profile");
    const buttonUploadBackground = container.querySelector(
      ".image-upload-label",
    );

    background.addEventListener("mouseover", () => {
      buttonUploadBackground.style.display = "inline-block";
    });

    background.addEventListener("mouseout", () => {
      // Убираем кнопку только если курсор не над кнопкой
      if (!buttonUploadBackground.matches(":hover")) {
        buttonUploadBackground.style.display = "none";
      }
    });

    // Добавляем обработчик для кнопки, чтобы она оставалась видимой при наведении
    buttonUploadBackground.addEventListener("mouseover", () => {
      buttonUploadBackground.style.display = "inline-block";
    });

    buttonUploadBackground.addEventListener("mouseout", () => {
      buttonUploadBackground.style.display = "none";
    });

    background.addEventListener("mouseout", () => {
      const buttonUploadBackground = container.querySelector(
        ".image-upload-label",
      );
      buttonUploadBackground.style.display = "none";
    });
  }
  const rightContainer = document.querySelector(`.profile-form`);
  controlSlideShow(container, rightContainer);
}

export { controlMediaProfile };
