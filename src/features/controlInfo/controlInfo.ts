import { update } from "../../../lib/vdom/lib";
import { setVibe } from "../setvibe/setvibe";
import { getPageAuthor } from "../getpageauthor/getpageauthor";
import { renderAbout } from "../../entities/profileabout";
import DOMPurify from "dompurify";
import { setStatic } from "../../shared/getStatic/getStatic";
import { iconEditStatus } from "../../app";

/**
 * УПравление информацией "О СЕБЕ"
 * @param authorData Данные об авторе
 * @param container Контейнер "О СЕБЕ"
 * @returns
 */
function controlInfo(authorData: any, container: any) {
  const title = container.querySelector(`.about-profile`);
  if (title.textContent === "" && window.location.pathname !== "/profile") {
    title.textContent = "Автор еще ничего про себя не написал";
  }
  if (window.location.pathname !== "/profile") {
    return 0;
  }

  // Обработчик для кнопки "Редактировать"
  const handleClick = async (event: any) => {
    if (event.target.classList.contains("edit-info-button")) {
      try {
        const currentText: any = container.querySelector(".about-profile");
        const newdataUser = await getPageAuthor(window.location.pathname);
        const content: any = renderAbout(newdataUser, true);
        const place: any = document.querySelector(`.place-edit-info`);
        update(place, content);
        const iconDivEditStatus = place.querySelector(`.edit-info-button`);
        if (iconDivEditStatus) {
          setStatic(iconDivEditStatus, iconEditStatus);
        }
        return;
      } catch (error) {
        console.error("Ошибка при обновлении информации:", error);
      }
    }

    if (event.target.classList.contains("save-info-button")) {
      const input = container.querySelector(`.about-input`);
      let newValue = input.value;
      const sanitizedValue = DOMPurify.sanitize(newValue.value);

      if (sanitizedValue.trim() === "") newValue = "Укажите чем вы занимаетесь";
      // Сохраняем информацию
      try {
        const response = await setVibe(newValue);
        const newdataUser = await getPageAuthor(window.location.pathname);
        const content = renderAbout(newdataUser, false, newValue);
        const place: any = document.querySelector(`.place-edit-info`);
        update(place, content);
        const iconDivEditStatus = place.querySelector(`.edit-info-button`);
        if (iconDivEditStatus) {
          setStatic(iconDivEditStatus, iconEditStatus);
        }
        return;
      } catch (error) {
        console.error("Ошибка при обновлении информации:", error);
      }
    }

    if (event.target.classList.contains("cancel-info-button")) {
      const input = container.querySelector(`.about-input`);
      const currentText = input.value;
      if (!DOMPurify.sanitize(currentText)) {
        return;
      }
      const newdataUser = await getPageAuthor(window.location.pathname);
      const content = renderAbout(newdataUser, false, currentText);
      const place: any = document.querySelector(`.place-edit-info`);
      update(place, content);
      const iconDivEditStatus = place.querySelector(`.edit-info-button`);
      if (iconDivEditStatus) {
        setStatic(iconDivEditStatus, iconEditStatus);
      }
      return;
    }
    // container.removeEventListener("click", handleClick);
  };
  container.addEventListener("click", handleClick);
}

export { controlInfo };
