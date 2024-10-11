import { state, ELEMENTS_CLASS } from "./consts";
import { renderLogin } from "./auth/loginView";
import { renderSignup } from "./auth/signupView";
import { renderError } from "./pages/error";
import { renderProfile } from "./pages/profileView";
import { renderHome } from "./pages/home";
import { LINKS } from "./consts";
import { startA } from "./menu/menu";
import "./styles/style.css";
/**
 * Объект, содержащий конфигурацию меню приложения.
 */
const config: any = {
  menu: {
    home: {
      href: LINKS.HOME.HREF as string,
      text: LINKS.HOME.TEXT as string,
      render: renderHome as () => HTMLInputElement | undefined,
    },
    login: {
      href: LINKS.LOGIN.HREF as string,
      text: LINKS.LOGIN.TEXT as string,
      render: renderLogin as () => HTMLInputElement | undefined,
    },
    signup: {
      href: LINKS.SIGNUP.HREF as string,
      text: LINKS.SIGNUP.TEXT as string,
      render: renderSignup as () => HTMLInputElement | undefined,
    },
    profile: {
      href: LINKS.PROFILE.HREF as string,
      text: LINKS.PROFILE.TEXT as string,
      render: renderProfile as () => Promise<HTMLElement> | undefined,
    },
    error: {
      href: LINKS.ERROR.HREF as string,
      text: LINKS.ERROR.TEXT as string,
      render: renderError as () => HTMLInputElement | undefined,
    },
  },
};
interface State {
  activePageLink: HTMLElement | null;
}

const state2: State = {
  activePageLink: null,
};

/**
 * Перенаправляет на другую страницу приложения.
 * @param {*} targetLinkMenu Ссылка на страницу, на которую нужно перенаправить
 * @param {*} statusErr Статус ошибки (необязательный)
 */

export function goToPage(targetLinkMenu: any, statusErr = null) {
  pageContainer.innerHTML = "";
  state2.activePageLink?.classList.remove(ELEMENTS_CLASS.ACTIVE);
  targetLinkMenu.classList.add(ELEMENTS_CLASS.ACTIVE);
  if (targetLinkMenu.dataset.section === "profile") {
    state.activePageLink = targetLinkMenu;
    config.menu[targetLinkMenu.dataset.section]
      .render(statusErr)
      .then((newPageElement: any) => {
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

/*
export function goToPage(targetLinkMenu: any, statusErr = null) { 
  pageContainer.innerHTML = "";
  state2.activePageLink?.classList.remove(ELEMENTS_CLASS.ACTIVE);
  targetLinkMenu.classList.add(ELEMENTS_CLASS.ACTIVE);

  if (targetLinkMenu.dataset.section === "profile") {
    state.activePageLink = targetLinkMenu;

    const newPageElement = document.createElement('div');
    newPageElement.textContent = "This is the profile page.";
    pageContainer.appendChild(newPageElement);
  } else {
    const newPageElement = document.createElement('div');
    newPageElement.textContent = `Rendering section: ${targetLinkMenu.dataset.section || "unknown"}`;
    pageContainer.appendChild(newPageElement);
  }
}
  */
var root: HTMLElement | null = startA(config.menu, state);

const pageContainer = document.createElement("main");
root?.appendChild(pageContainer);

goToPage((state.menuElements as { home: HTMLElement }).home);
