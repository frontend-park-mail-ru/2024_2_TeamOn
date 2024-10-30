import { LINKS, state } from "../consts";
import { goToPage } from "../index";
import { nonauth } from "./nonauth";

class Routing {
  public history: string[] = [];
  public currentIndex: number = -1;

  public navigate(url: string, callback?: () => void): void {
    // Удаляем все страницы после текущего индекса, если он не последний
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Добавляем новую страницу в историю
    this.history.push(url);
    this.currentIndex++;

    // Обновляем состояние браузера
    window.history.pushState({}, "", url);

    if (callback) {
      callback();
    }
  }
  public updateHistory() {
    this.history = [];
    const currentState = window.location.pathname;
    this.history.push(currentState);
    window.history.replaceState({ index: 0 }, "", currentState);
  }
}

interface MenuElements {
  profile: HTMLElement;
  feed: HTMLElement;
  settings: HTMLElement;
  notifications: HTMLElement;
  home: HTMLElement;
  login: HTMLElement;
  signup: HTMLElement;
}

function updatePageContent(render: string): void {
  const feedRegex = /^\/profile\/\d+$/;
  const menuElements: MenuElements = state.menuElements as MenuElements;

  if (
    feedRegex.test(render) ||
    [
      LINKS.FEED.HREF,
      LINKS.PROFILE.HREF,
      LINKS.SETTINGS.HREF,
      LINKS.NOTIFICATIONS.HREF,
    ].includes(render)
  ) {
    if (nonauth()) return;
    const pageMap: Record<string, keyof MenuElements> = {
      [LINKS.FEED.HREF]: "feed",
      [LINKS.PROFILE.HREF]: "profile",
      [LINKS.SETTINGS.HREF]: "settings",
      [LINKS.NOTIFICATIONS.HREF]: "notifications",
    };
    goToPage(menuElements[pageMap[render]] || menuElements.profile);
    return;
  }

  const defaultPages: Record<string, keyof MenuElements> = {
    [LINKS.HOME.HREF]: "home",
    [LINKS.LOGIN.HREF]: "login",
    [LINKS.SIGNUP.HREF]: "signup",
  };

  if (defaultPages[render]) {
    goToPage(menuElements[defaultPages[render]]);
  } else {
    goToPage(menuElements.home);
  }
}

export const routing = new Routing();
routing.updateHistory();
/**
 * Роутинг без кнопки назад
 * @param fromTo Ссылка, куда нужно редирекаться
 */
export function route(fromTo: string, currentUrl?: any): void {
  if (currentUrl) {
    updatePageContent(currentUrl);
    return;
  }
  routing.navigate(fromTo);
  console.log(fromTo);

  updatePageContent(fromTo);
  return;
}

window.addEventListener("popstate", () => {
  const currentState = window.location.pathname;
  const pageIndex = routing.history.indexOf(currentState);
  routing.currentIndex = pageIndex; // Обновляем текущий индекс
  console.log(currentState);
  updatePageContent(currentState); // Обновляем содержимое страницы
});
