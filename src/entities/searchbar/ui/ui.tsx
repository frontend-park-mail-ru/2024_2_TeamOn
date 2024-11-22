import * as VDom from "vdom"; 
import { ELEMENTS_CLASS, LINKS } from "../../../shared/consts/consts";
import { resSearch } from '../index';  // Импортируем функцию, которую хотите использовать

/**
 * Функция рендера серчбара
 * @returns
 */
function renderSearchbar() {
  const isFeedPage = window.location.pathname === LINKS.FEED.HREF;
  
  // Создаем контейнер с поисковым полем
  const searchbar = (
    <div className={`searchbar-container ${isFeedPage ? 'feed-search' : 'home-search'}`}>
      <div class="searchbar-wrapper">
        <i class="fas fa-search searchbar-icon searchbar-icon--left"></i>
        <input 
          type="text" 
          class="searchbar-input" 
          placeholder="Найти автора" 
          oninput={resSearch}  
        />
        <i class="fas fa-times searchbar-icon searchbar-icon--right"></i>
        <div class="author-dropdown" id="author-dropdown"></div>
      </div>
    </div>
  );

  return searchbar;
}

export { renderSearchbar };
