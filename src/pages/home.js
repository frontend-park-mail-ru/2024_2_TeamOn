import { state } from "../consts.js";
import { goToPage } from "../index.js";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts.js";
import { getItemLocalStorage } from "../utils/storages.js";
import { getCurrentUser } from "./profile.js";

export function renderHome() {
  const savedLogin = getItemLocalStorage("login");
  const user = getCurrentUser();
  if (user) {
    state.currentUser = user;
    goToPage(state.menuElements.profile);
  } else {
    const container = document.createElement(ELEMENTS.DIV);
    const overlay = document.createElement(ELEMENTS.DIV);
    const header = document.createElement(ELEMENTS.DIV);
    const buttons = document.createElement(ELEMENTS.DIV);
    const loginButton = document.createElement(ELEMENTS.A);

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
      goToPage(state.menuElements.login);
    };
    return container;
  }
}
