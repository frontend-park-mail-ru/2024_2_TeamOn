import { update } from "../../../lib/vdom/lib";
import { setVibe } from "../setvibe/setvibe";
import { getPageAuthor } from "../getpageauthor/getpageauthor";
import { renderAbout } from "../../entities/profileabout";
import DOMPurify from "dompurify";

/**
 * УПравление информацией "О СЕБЕ"
 * @param authorData Данные об авторе
 * @param container Контейнер "О СЕБЕ"
 * @returns
 */
function controlInfo(authorData: any, container: any) {
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
        return;
      } catch (error) {
        console.error("Ошибка при обновлении информации:", error);
      }
    }

    if (event.target.classList.contains("save-info-button")) {
      const input = container.querySelector(`.about-input`);
      const newValue = input.value;

      // Сохраняем информацию
      try {
        const response = await setVibe(newValue);
        const newdataUser = await getPageAuthor(window.location.pathname);
        const content = renderAbout(newdataUser, false, newValue);
        const place: any = document.querySelector(`.place-edit-info`);
        update(place, content);
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
      return;
    }
    // container.removeEventListener("click", handleClick);
  };
  container.addEventListener("click", handleClick);
}

export { controlInfo };
