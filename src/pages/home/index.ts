import { ELEMENTS_CLASS, LINKS } from "../../shared/consts/consts";
import { route } from "../../shared/routing/routing";
import { hasLogged } from "../../shared/utils/hasLogged";
import { clearHistoryBrowser } from "../../shared/utils/clearHistory";
import { pageContainer } from "../../app/index";
import { createElement, createText, update } from "../../../lib/vdom/lib";
import {
  controllerMask,
  createMask,
} from "../../shared/utils/utilsView/circle";
import { VNode } from "../../../lib/vdom/src/source";
import { containerHome } from "./ui/home";

/**
 * Обработка домашней страницы
 */
export function renderHome() {
  if (hasLogged()) {
    route(LINKS.FEED.HREF);
  } else {
    document.body.style.height = "100vh";
    clearHistoryBrowser();

    const vdom: VNode = containerHome();

    const container = update(pageContainer, vdom);

    const button: any = container.querySelector(
      `.${ELEMENTS_CLASS.HOME_BUTTONS.BLOCK}`,
    );
    button.addEventListener("click", () => {
      route(LINKS.LOGIN.HREF);
    });

    if (window.location.pathname !== LINKS.HOME.HREF) {
      route(LINKS.HOME.HREF, window.location.pathname);
    }

    const containerSecond: any = container.querySelector(
      `.${ELEMENTS_CLASS.HOME.HOME_CONTAINER_SEC}`,
    ) as HTMLElement;

    const homeContainer: any = container.querySelector(
      `.${ELEMENTS_CLASS.HOME.HOME_CONTAINER}`,
    ) as HTMLElement;

    if (window.location.pathname == LINKS.HOME.HREF) {
      // Создаем маску для выжигания
      const mask = createMask();

      homeContainer.appendChild(mask);

      // Запускаем анимацию с помощью requestAnimationFrame
      function animate() {
        controllerMask(homeContainer, containerSecond, mask);
        // Запланировать следующий кадр анимации
        requestAnimationFrame(animate);
      }

      // Начинаем анимацию
      requestAnimationFrame(animate);
    }
    return container;
  }
}
