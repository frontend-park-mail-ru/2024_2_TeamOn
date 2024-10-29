import { state, ELEMENTS_CLASS, LINKS, REGEXP } from "./consts";
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
import { VirtualDOM } from "./lib/vdom/src/source";
import { render } from "./lib/vdom/lib";

/**
 * Объект, содержащий конфигурацию меню приложения.
 */

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

export function setupScrollPositionHandlers() {
  document.addEventListener("DOMContentLoaded", () => {
    const saveScrollPosition = () => {
      const scrollPosition: any = window.scrollY;
      sessionStorage.setItem("scrollPosition", scrollPosition);
    };

    // Сохраняем позицию прокрутки при прокрутке
    window.addEventListener("scroll", saveScrollPosition);

    // Восстанавливаем позицию прокрутки при загрузке страницы
    window.addEventListener("load", () => {
      const savedScrollPosition = sessionStorage.getItem("scrollPosition");
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }
    });

    // Сохраняем позицию прокрутки перед выгрузкой страницы
    window.addEventListener("beforeunload", saveScrollPosition);

    // Обработка события popstate для навигации
    window.addEventListener("popstate", () => {
      const savedScrollPosition = sessionStorage.getItem("scrollPosition");
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }
    });
  });
  return true;
}
const flag: any = setupScrollPositionHandlers();

// Вызовите эту функцию один раз в начале вашего приложения
// setupScrollPositionHandlers();
/**
 * Перенаправляет на другую страницу приложения.
 * @param {*} targetLinkMenu Ссылка на страницу, на которую нужно перенаправить
 * @param {*} statusErr Статус ошибки (необязательный)
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
export const pageContainer = document.createElement("main");
if (flag) {
  var root: HTMLElement | null = startA(config.menu, state);

  render(Virtual);

  root?.appendChild(pageContainer);
  route(LINKS.HOME.HREF, window.location.pathname);
}