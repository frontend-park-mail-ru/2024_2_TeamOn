<<<<<<< HEAD
import { state, ELEMENTS_CLASS, LINKS, REGEXP } from "./consts";
=======
import { state, ELEMENTS_CLASS } from "./consts";
>>>>>>> 9d42475ac93784d07320ccdb38ff5a0f802b4773
import { renderLogin } from "./auth/loginView";
import { renderSignup } from "./auth/signupView";
import { renderProfile } from "./pages/profile/profile";
import { renderHome } from "./pages/home";
import { startA } from "./menu/menu";
import "./styles/style.css";
import { renderFeed } from "./pages/feed/feed";
import { route } from "./utils/routing";
import { renderNotifications } from "./pages/notifications/notifications";
import { renderSettings } from "./pages/settings/settingsView";
<<<<<<< HEAD
=======
import { VirtualDOM } from "./lib/vdom/src/source";
import { render } from "./lib/vdom/lib";
>>>>>>> 9d42475ac93784d07320ccdb38ff5a0f802b4773

/**
 * Объект, содержащий конфигурацию меню приложения.
 */
/*const config: any = {
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
<<<<<<< HEAD
      href: LINKS.ERROR.HREF as string,
      text: LINKS.ERROR.TEXT as string,
=======
      href: LINKS.SETTINGS.HREF as string,
      text: LINKS.SETTINGS.TEXT as string,
>>>>>>> 9d42475ac93784d07320ccdb38ff5a0f802b4773
      render: renderSettings as () => Promise<HTMLElement> | undefined,
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
};*/
interface SyncLinkConfig {
  href: string;
  text: string;
  render: () => Element | undefined;
}

interface AsyncLinkConfig {
  href: string;
  text: string;
  render: () => Promise<HTMLElement> | undefined;
}

interface MenuConfig {
  home: SyncLinkConfig;
  login: SyncLinkConfig;
  signup: SyncLinkConfig;
  profile: AsyncLinkConfig;
  settings: AsyncLinkConfig;
  feed: AsyncLinkConfig;
  notifications: AsyncLinkConfig;
}

interface Config {
  menu: MenuConfig;
}

const config: Config = {
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
    settings: {
      href: LINKS.ERROR.HREF,
      text: LINKS.ERROR.TEXT,
      render: renderSettings,
    },
    feed: {
      href: LINKS.FEED.HREF,
      text: LINKS.FEED.TEXT,
      render: renderFeed,
    },
    notifications: {
      href: LINKS.NOTIFICATIONS.HREF,
      text: LINKS.NOTIFICATIONS.TEXT,
      render: renderNotifications,
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
<<<<<<< HEAD
/*
export function goToPage(targetLinkMenu: any, statusErr = null) {
=======
export function goToPage(targetLinkMenu: any) {
>>>>>>> 9d42475ac93784d07320ccdb38ff5a0f802b4773
  pageContainer.innerHTML = "";
  state2.activePageLink?.classList.remove(ELEMENTS_CLASS.ACTIVE);
  targetLinkMenu.classList.add(ELEMENTS_CLASS.ACTIVE);

  if (
<<<<<<< HEAD
    targetLinkMenu == "http://localhost:8088/feed/profile" ||
    targetLinkMenu == "http://localhost:8088/feed" ||
    targetLinkMenu == "http://localhost:8088/feed/notifications" ||
    targetLinkMenu == "http://localhost:8088/feed/settings"
=======
    targetLinkMenu == "http://pushart.online/feed/profile" ||
    targetLinkMenu == "http://pushart.online/feed" ||
    targetLinkMenu == "http://pushart.online/feed/notifications" ||
    targetLinkMenu == "http://pushart.online/feed/settings" ||
    targetLinkMenu == "http://localhost:8080/feed/profile" ||
    targetLinkMenu == "http://localhost:8080/feed" ||
    targetLinkMenu == "http://localhost:8080/feed/notifications" ||
    targetLinkMenu == "http://localhost:8080/feed/settings"
>>>>>>> 9d42475ac93784d07320ccdb38ff5a0f802b4773
  ) {
    state.activePageLink = targetLinkMenu;
    config.menu[targetLinkMenu.dataset.section].render();
    return;
  }

  config.menu[targetLinkMenu.dataset.section].render();
}
*/

export function goToPage(targetLinkMenu: any, statusErr = null) {
  pageContainer.innerHTML = ""; 
  state2.activePageLink?.classList.remove(ELEMENTS_CLASS.ACTIVE);
  targetLinkMenu.classList.add(ELEMENTS_CLASS.ACTIVE);

  const sectionKey = targetLinkMenu.dataset.section as keyof MenuConfig;
  const routeConfig = config.menu[sectionKey];

  const renderPromise = Promise.resolve(routeConfig.render());
  renderPromise
    .then((newPageElement) => {
      if (newPageElement) {
        pageContainer.appendChild(newPageElement);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
    });
}

var root: HTMLElement | null = startA(config.menu, state);

export const Virtual: any = new VirtualDOM();
render(Virtual);

export const pageContainer = document.createElement("main");
root?.appendChild(pageContainer);
<<<<<<< HEAD
=======

>>>>>>> 9d42475ac93784d07320ccdb38ff5a0f802b4773
route(LINKS.HOME.HREF, window.location.pathname);
