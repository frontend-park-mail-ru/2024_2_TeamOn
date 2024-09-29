import { state, ELEMENTS_CLASS } from "./consts.js";
import { renderLogin } from "./auth/loginView.js";
import { renderSignup } from "./auth/signupVew.js";
import { renderError } from "./pages/error.js";
import { renderProfile } from "./pages/profile.js";
import { renderHome } from "./pages/home.js";
import { LINKS } from "./consts.js";
import { startA } from "./menu/menu.js";

/**
 * Объект, содержащий конфигурацию меню приложения.
 */
const config = {
  menu: {
    home: {
      href: LINKS.HOME.HREF,
      text: LINKS.HOME.TEXT,
      render: renderHome,
    },
    login: {
      href: LINKS.LOGIN.HREF,
      text: LINKS.LOGIN.TEXT,
      render: renderLogin,
    },
    signup: {
      href: LINKS.SIGNUP.HREF,
      text: LINKS.SIGNUP.TEXT,
      render: renderSignup,
    },
    profile: {
      href: LINKS.PROFILE.HREF,
      text: LINKS.PROFILE.TEXT,
      render: renderProfile,
    },
    error: {
      href: LINKS.ERROR.HREF,
      text: LINKS.ERROR.TEXT,
      render: renderError,
    },
  },
};

/**
 * Перенаправляет на другую страницу приложения.
 * @param {*} targetLinkMenu Ссылка на страницу, на которую нужно перенаправить
 * @param {*} statusErr Статус ошибки (необязательный)
 */
export function goToPage(targetLinkMenu, statusErr = null) {
  pageContainer.innerHTML = "";
  state.activePageLink.classList.remove(ELEMENTS_CLASS.ACTIVE);
  targetLinkMenu.classList.add(ELEMENTS_CLASS.ACTIVE);
  if (targetLinkMenu == "http://pushart.online/profile") {
    state.activePageLink = targetLinkMenu;
    config.menu[targetLinkMenu.dataset.section]
      .render(statusErr)
      .then((newPageElement) => {
        pageContainer.appendChild(newPageElement);
      });
  } else {
    const newPageElement =
      config.menu[targetLinkMenu.dataset.section].render(statusErr);
    if (newPageElement) {
      pageContainer.appendChild(newPageElement);
    }
  }
}

var root = startA(config.menu, state);

const pageContainer = document.createElement("main");
root.appendChild(pageContainer);

goToPage(state.menuElements.home);
