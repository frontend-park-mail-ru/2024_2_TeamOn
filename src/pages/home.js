import { state, ELEMENTS_CLASS } from "../consts.js"; // Объединение импортов
import { goToPage } from "../index.js";
import { getItemLocalStorage } from "../utils/storages.js";
import { getCurrentUser } from "./profile.js";
import homeTemplate from '../templates/homeTemplate.hbs'; 

export function renderHome() {
  const savedLogin = getItemLocalStorage("login");
  const user = getCurrentUser();

  if (user) {
    state.currentUser = user;
    goToPage(state.menuElements.profile);
  } else {
    const templateContext = {
      ELEMENTS_CLASS
    };

    const container = document.createElement('div');
    container.innerHTML = homeTemplate(templateContext);

    const loginButton = container.querySelector('#loginButton');

    if (loginButton) { // Проверка на существование элемента
      loginButton.onclick = () => {
        goToPage(state.menuElements.login);
      };
    }

    return container;
  }
}
