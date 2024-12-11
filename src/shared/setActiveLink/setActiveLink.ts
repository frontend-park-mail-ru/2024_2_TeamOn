import { sidebarLinks } from "../consts/consts";

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
