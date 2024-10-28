import { ELEMENTS_CLASS, LINKS } from "../consts";
import { route } from "../utils/routing";
import { hasLogged } from "../utils/hasLogged";
import { ClearHistoryBrowser } from "../utils/clearHistory";
import { pageContainer, Virtual } from "../index";
import { createElement, createText, render, update } from "../lib/vdom/lib";
import { createElementJSX } from "../lib/jsx/lib";
import { controllerMask, createMask } from "../utils/utilsView/circle";
import { VirtualDOM, VNode } from "../lib/vdom/src/source";
import { Container } from "../../node_modules/postcss/lib/postcss";

/**
 * Обработка домашней страницы
 */
export function renderHome() {
  if (hasLogged()) {
    route(LINKS.FEED.HREF);
  } else {
    document.body.style.height = "100vh";
    ClearHistoryBrowser();

    const vdom: VNode = createElement(
      "div",
      { class: ELEMENTS_CLASS.HOME.HOME_CONTAINER },
      [
        createElement(
          "div",
          { class: ELEMENTS_CLASS.HOME.HOME_CONTAINER_SEC },
          [],
        ),
        createElement("div", { class: ELEMENTS_CLASS.HOME.HOME_OVERLAY }, []),
        createElement("div", { class: ELEMENTS_CLASS.HOME.HOME_HEADER }, [
          createText("PUSHART"),
        ]),
        createElement("div", { class: ELEMENTS_CLASS.HOME_BUTTONS.BLOCK }, [
          createElement("a", { class: ELEMENTS_CLASS.HOME_BUTTONS.COMBINE }, [
            createText("Войти"),
          ]),
        ]),
      ],
    );

    const container = update(pageContainer, vdom);

    const button: any = container.querySelector(
      `.${ELEMENTS_CLASS.HOME_BUTTONS.BLOCK}`,
    );
    console.log(button);
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
  }
}
