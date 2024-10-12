import { RouterLinks, state } from "../consts";
import { goToPage, initHomePage } from "../index";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts";
import { getItemLocalStorage } from "../utils/storages";
import { ClearHistoryBrowser } from "../utils/clearHistory";
import { route } from "../utils/routing";

/**
 * Обработка домашней страницы
 */
export function renderHome() {
  const hasLoggedInUser = Array.from({ length: localStorage.length }).some(
    (_, i) => getItemLocalStorage(localStorage.key(i)) === "1",
  );

  if (hasLoggedInUser && initHomePage) {
    route(RouterLinks.FEED);
  } else {
    ClearHistoryBrowser();
    const container = document.createElement(ELEMENTS.DIV) as HTMLInputElement;
    const overlay = document.createElement(ELEMENTS.DIV) as HTMLInputElement;
    const header = document.createElement(ELEMENTS.DIV) as HTMLInputElement;
    const buttons = document.createElement(ELEMENTS.DIV) as HTMLInputElement;
    const loginButton = document.createElement(ELEMENTS.A) as HTMLInputElement;

    container.classList.add(ELEMENTS_CLASS.HOME_CONTAINER);

    overlay.classList.add(ELEMENTS_CLASS.HOME_OVERLAY);

    header.classList.add(ELEMENTS_CLASS.HOME_HEADER);
    header.textContent = "PUSHART";

    buttons.classList.add(ELEMENTS_CLASS.HOME_BUTTONS);

    loginButton.classList.add(ELEMENTS_CLASS.HOME_BUTTON);
    loginButton.textContent = "Войти";

    container.appendChild(overlay);
    container.appendChild(header);
    buttons.appendChild(loginButton);
    container.appendChild(buttons);

    loginButton.onclick = () => {
      goToPage((state.menuElements as { login: HTMLElement }).login);
    };

    return container;
  }
}
