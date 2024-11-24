import * as VDom from "vdom";
import { ELEMENTS_CLASS, LINKS } from "../../../shared/consts/consts";

//import { resSearch } from "../index"; // Импортируем функцию, которую хотите использовать

/**
 * Функция рендера серчбара
 * @returns
 */
function renderSearchbar() {
  const isFeedPage = window.location.pathname === LINKS.FEED.HREF;

  // Создаем контейнер с поисковым полем
  return (
    <div className="searchbar-container">
      <div class="searchbar-wrapper">
        <button class="fas fa-search searchbar-icon searchbar-icon--left"></button>
        <input
          type="text"
          class="searchbar-input"
          placeholder="Найти автора"
          id="searchInput"
        />
        <button class="fas fa-times searchbar-icon searchbar-icon--right"></button>
        <div class="results">
          <div class="result-item">
            <div class="title"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { renderSearchbar };
