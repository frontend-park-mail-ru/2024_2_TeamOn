import { ELEMENTS, ELEMENTS_CLASS } from "../consts";

/**
 * Функция инициализирует приложение.
 * @param {*} conf Конфигурационный объект
 * @param {*} state Объект состояния приложения
 * @returns Корневой элемент приложения
 */
export function startA(conf: any, state: any) {
  function renderMenu(conf: any) {
    (
      Object.entries(conf) as [string, { href: string; text: string }][]
    ).forEach(([key, { href, text }], index) => {
      const menuElement = document.createElement(
        ELEMENTS.A,
      ) as HTMLAnchorElement;
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
