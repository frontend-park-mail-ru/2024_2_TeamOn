import { ELEMENTS, ELEMENTS_CLASS } from "../consts.js";

/**
 * Функция инициализирует приложение.
 * @param {*} conf Конфигурационный объект
 * @param {*} state Объект состояния приложения
 * @returns Корневой элемент приложения
 */
export function startA(conf, state) {
  function renderMenu(conf) {
    Object.entries(conf).forEach(([key, { href, text }], index) => {
      const menuElement = document.createElement(ELEMENTS.A);
      menuElement.href = href;
      menuElement.textContent = text;
      menuElement.dataset.section = key;

      if (index === 0) {
        menuElement.classList.add(ELEMENTS_CLASS.ACTIVE);
        state.activePageLink = menuElement;
      }
      state.menuElements[key] = menuElement;
      menuContainer.appendChild(menuElement);
    });
  }
  const root = document.getElementById("root");
  const menuContainer = document.createElement("aside");

  renderMenu(conf);
  return root;
}
