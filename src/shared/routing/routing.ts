import { LINKS, state } from "../consts/consts";
import { goToPage } from "../../app/index";
import { gotoauthor } from "../gotoauthor/gotoauthor";
import { findUsername, hasLogged } from "../utils/hasLogged";
import { getPageAuthor } from "../../features/getpageauthor/getpageauthor";

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
  createPost: HTMLLIElement;
  updatePost: HTMLElement;
  moderation: HTMLElement;
}
/**
 * Функция обновления контента на странице
 * @param render Ссылка на страницу
 * @returns
 */
async function updatePageContent(render: string): Promise<void> {
  const feedRegex = /^\/profile\/[0-9a-zA-Z-]+$/;
  const menuElements: MenuElements = state.menuElements as MenuElements;
  const authorPayRegex = /^\/profile\/[0-9a-zA-Z-]+(\?act=payments)?$/;
  if (feedRegex.test(render) && window.location.pathname !== "/profile") {
    const authorId: any = render.split("/").pop();
    sessionStorage.setItem("authorid", authorId);
    if (hasLogged()) {
      const myUsername: any = findUsername();
      const user: any = await getPageAuthor(window.location.pathname, authorId);

      if (myUsername === user.authorUsername) {
        route("/profile");
      }
    }
  }
  if (
    feedRegex.test(render) ||
    authorPayRegex.test(render) ||
    [
      LINKS.FEED.HREF,
      LINKS.PROFILE.HREF,
      LINKS.SETTINGS.HREF,
      LINKS.NOTIFICATIONS.HREF,
      LINKS.CREATE_POST.HREF,
      LINKS.UPDATE_POST.HREF,
      LINKS.MODERATION.HREF,
    ].includes(render)
  ) {
    const pageMap: Record<string, keyof MenuElements> = {
      [LINKS.FEED.HREF]: "feed",
      [LINKS.PROFILE.HREF]: "profile",
      [LINKS.SETTINGS.HREF]: "settings",
      [LINKS.NOTIFICATIONS.HREF]: "notifications",
      [LINKS.CREATE_POST.HREF]: "createPost",
      [LINKS.UPDATE_POST.HREF]: "updatePost",
      [LINKS.MODERATION.HREF]: "moderation",
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

  updatePageContent(fromTo);
  return;
}

window.addEventListener("popstate", () => {
  const currentState = window.location.pathname;
  const pageIndex = routing.history.indexOf(currentState);
  routing.currentIndex = pageIndex; // Обновляем текущий индекс
  updatePageContent(currentState); // Обновляем содержимое страницы
});
