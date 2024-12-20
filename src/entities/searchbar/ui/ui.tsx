import * as VDom from "vdom";
import { LINKS } from "../../../shared/consts/consts";

/**
 * Функция рендера серчбара
 * @returns
 */
const renderSearchbar = () => {
  // function renderSearchbar() {
  const isFeedPage =
    window.location.pathname === LINKS.FEED.HREF ||
    window.location.pathname === LINKS.MODERATION.HREF;
  const customClass = isFeedPage
    ? "searchbar-wrapper-feed"
    : "searchbar-wrapper";
  const color = isFeedPage ? "color: black" : "";
  const classContainer = isFeedPage ? "" : "searchbar-container";
  return (
    <div class={classContainer}>
      <div class={customClass}>
        <button class="fas fa-search searchbar-icon searchbar-icon--left"></button>
        <input
          type="text"
          class="searchbar-input"
          placeholder="Найти автора"
          id="searchInput"
          style={color}
        />
        <button class="fas fa-times searchbar-icon searchbar-icon--right"></button>
      </div>
      <div class="results" style="display: none;">
        <div class="loader__search" style="display: none;"></div>
        <div class="result-item"></div>
      </div>
    </div>
  );
};

export { renderSearchbar };
