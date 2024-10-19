import { state } from "../consts";
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
  const feedRegex = /^\/feed\/\d+$/;
  if (feedRegex.test(render)) {
    nonauth();
    goToPage((state.menuElements as { profile: HTMLElement }).profile);
  }
  switch (render) {
    case "/feed":
      nonauth();
      goToPage((state.menuElements as { feed: HTMLElement }).feed);
      break;
    case "/feed/profile":
      nonauth();
      goToPage((state.menuElements as { profile: HTMLElement }).profile);
      break;
    case "/feed/settings":
      nonauth();
      goToPage((state.menuElements as { settings: HTMLElement }).settings);
      break;
    case "/":
      goToPage((state.menuElements as { home: HTMLElement }).home);
      break;
    case "/login":
      goToPage((state.menuElements as { login: HTMLElement }).login);
      break;
    case "/signup":
      goToPage((state.menuElements as { signup: HTMLElement }).signup);
      break;
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
}

window.addEventListener("popstate", () => {
  const currentState = window.location.pathname;
  const pageIndex = routing.history.indexOf(currentState);
  routing.currentIndex = pageIndex; // Обновляем текущий индекс
  console.log(currentState);
  updatePageContent(currentState); // Обновляем содержимое страницы
});
