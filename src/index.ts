import { state, ELEMENTS_CLASS } from "./consts";
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
import { renderSettings } from "./pages/settings/settingsView";
import { VirtualDOM } from "./lib/vdom/src/source";
import { render } from "./lib/vdom/lib";

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
      href: LINKS.SETTINGS.HREF as string,
      text: LINKS.SETTINGS.TEXT as string,
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
};
interface State {
  activePageLink: HTMLElement | null;
}

const state2: State = {
  activePageLink: null,
};
// export function setupScrollPositionHandlers() {
//   const cords: Array<'scrollX' | 'scrollY'> = ['scrollX', 'scrollY'];

//   // Сохраняем текущую позицию прокрутки в localStorage при закрытии страницы
//   window.addEventListener('beforeunload', () => {
//     cords.forEach(cord => {
//       localStorage.setItem(cord, window[cord].toString());
//     });
//   });

//   // Восстанавливаем позицию прокрутки из localStorage при загрузке страницы
//   document.addEventListener('DOMContentLoaded', () => {
//     const savedScrollX = localStorage.getItem('scrollX') || '0';
//     const savedScrollY = localStorage.getItem('scrollY') || '0';
//     window.scroll(parseInt(savedScrollX, 10), parseInt(savedScrollY, 10));
//   });

//   // Сохраняем координаты прокрутки при изменении истории
//   window.addEventListener('popstate', () => {
//     cords.forEach(cord => {
//       localStorage.setItem(cord, window[cord].toString());
//       alert(window[cord].toString())
//     });
//   });
// }

// setupScrollPositionHandlers();
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
export function goToPage(targetLinkMenu: any) {
  pageContainer.innerHTML = "";
  state2.activePageLink?.classList.remove(ELEMENTS_CLASS.ACTIVE);
  targetLinkMenu.classList.add(ELEMENTS_CLASS.ACTIVE);

  if (
    targetLinkMenu == "http://pushart.online/feed/profile" ||
    targetLinkMenu == "http://pushart.online/feed" ||
    targetLinkMenu == "http://pushart.online/feed/notifications" ||
    targetLinkMenu == "http://pushart.online/feed/settings" ||
    targetLinkMenu == "http://localhost:8080/feed/profile" ||
    targetLinkMenu == "http://localhost:8080/feed" ||
    targetLinkMenu == "http://localhost:8080/feed/notifications" ||
    targetLinkMenu == "http://localhost:8080/feed/settings"
  ) {
    state.activePageLink = targetLinkMenu;
    config.menu[targetLinkMenu.dataset.section].render();
    return;
  }

  config.menu[targetLinkMenu.dataset.section].render();
}
export const pageContainer = document.createElement("main");
export const Virtual: any = new VirtualDOM();
if (flag) {
  var root: HTMLElement | null = startA(config.menu, state);

  render(Virtual);

  root?.appendChild(pageContainer);

  route(LINKS.HOME.HREF, window.location.pathname);
}
