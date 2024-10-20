import { state, ELEMENTS_CLASS, RouterLinks, REGEXP } from "./consts";
import { renderLogin } from "./auth/loginView";
import { renderSignup } from "./auth/signupView";
import { renderProfile } from "./pages/profile/profile";
import { renderHome } from "./pages/home";
import { LINKS } from "./consts";
import { startA } from "./menu/menu";
import "./styles/style.css";
import { renderFeed } from "./pages/feed/feed";
import { route } from "./utils/routing";
import { renderNotifications } from "./pages/notifications/notifications";

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
    settings: {
      href: LINKS.ERROR.HREF as string,
      text: LINKS.ERROR.TEXT as string,
      render: renderSignup as () => HTMLInputElement | undefined,
    },
    feed: {
      href: LINKS.FEED.HREF as string,
      text: LINKS.FEED.TEXT as string,
      render: renderFeed as () => Promise<HTMLElement> | undefined,
    },
    notifications: {
      href: LINKS.NOTIFICATIONS.HREF as string,
      text: LINKS.NOTIFICATIONS.TEXT as string,
      render: renderNotifications as () => Promise<HTMLElement> | undefined,
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

  if (
    targetLinkMenu == "http://pushart.online/feed/profile" ||
    targetLinkMenu == "http://pushart.online/feed" ||
    targetLinkMenu == "http://pushart.online/feed/notifications"
  ) {
    state.activePageLink = targetLinkMenu;
    config.menu[targetLinkMenu.dataset.section]
      .render(statusErr)
      .then((newPageElement: any) => {
        pageContainer.appendChild(newPageElement);
      });
    return;
  }

  const newPageElement =
    config.menu[targetLinkMenu.dataset.section].render(statusErr);
  if (newPageElement) {
    pageContainer.appendChild(newPageElement);
    //pageContainer.innerHTML = newPageElement;
  }
}
var root: HTMLElement | null = startA(config.menu, state);

export const pageContainer = document.createElement("main");
root?.appendChild(pageContainer);
route(RouterLinks.HOME, window.location.pathname);
