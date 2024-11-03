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

function updatePageContent(render: string): void {
  const feedRegex = /^\/profile\/\d+$/;
  if (feedRegex.test(render)) {
    if (nonauth()) {
      return;
    }
    goToPage((state.menuElements as { profile: HTMLElement }).profile);
    return;
  }
  switch (render) {
    case LINKS.FEED.HREF:
      if (nonauth()) {
        break;
      }
      goToPage((state.menuElements as { feed: HTMLElement }).feed);
      break;
    case LINKS.PROFILE.HREF:
      if (nonauth()) {
        break;
      }
      goToPage((state.menuElements as { profile: HTMLElement }).profile);
      break;
    case LINKS.SETTINGS.HREF:
      if (nonauth()) {
        break;
      }
      goToPage((state.menuElements as { settings: HTMLElement }).settings);
      break;
    case LINKS.NOTIFICATIONS.HREF:
      if (nonauth()) {
        break;
      }
      goToPage(
        (state.menuElements as { notifications: HTMLElement }).notifications,
      );
      break;
    case LINKS.HOME.HREF:
      goToPage((state.menuElements as { home: HTMLElement }).home);
      break;
    case LINKS.LOGIN.HREF:
      goToPage((state.menuElements as { login: HTMLElement }).login);
      break;
    case LINKS.SIGNUP.HREF:
      goToPage((state.menuElements as { signup: HTMLElement }).signup);
      break;
    default: {
      goToPage((state.menuElements as { home: HTMLElement }).home);
    }
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
