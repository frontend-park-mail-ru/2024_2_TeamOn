import { ELEMENTS_CLASS, LINKS, LOCATIONS, sidebarLinks } from "../../consts";
import { renderLogoutButton } from "../profile/profile";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { VNode } from "../../lib/vdom/src/source";
import { fetchAjax } from "../../utils/fetchAjax";
import { route } from "../../utils/routing";
import { removeItemLocalStorage } from "../../utils/storages";
import { findUsername } from "../../utils/hasLogged";

/**
 * Функция установки активной ссылки
 * @param link Ссылка на страницу
 */
export function setActiveLink(link: any) {
  sidebarLinks.forEach((sidebarLink: any) => {
    if (link != sidebarLink) {
      sidebarLink.className = "";
      sidebarLink.active = false;
    }
  });
  link.active = true;
}

/**
 * Функция получения аккаунта
 * @returns
 */
export async function getAccount() {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.ACCOUNT.GET_ACCOUNT.METHOD,
      "/api/accounts/account",
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 401) {
          const name = findUsername();
          removeItemLocalStorage(name);
          route(LINKS.HOME.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
/**
 * Рендер медиа контента к постам (в разработке)
 * @param mediaContent  Медиа контент
 * @returns
 */
function rendermediaContent(mediaContent: any[]) {
  var result: any = [];
  mediaContent.forEach((media: any) => {
    const container: any = createElement(
      "img",
      { class: ELEMENTS_CLASS.POST.MEDIA },
      [],
    );
    result.push(container);
  });
  return result;
}
