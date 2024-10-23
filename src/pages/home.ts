import { LINKS } from "../consts";
import { route } from "../utils/routing";
import { hasLogged } from "../utils/hasLogged";
import { ClearHistoryBrowser } from "../utils/clearHistory";
import { VirtualDOM } from "../lib/vdom/src/source";
import { createElement, createText, render } from "../lib/vdom/lib";
import { createElementJSX } from "../lib/jsx/lib";
import { pageContainer } from "../index";
import { controllerMask, createMask } from "../utils/utilsView/circle";

/**
 * Обработка домашней страницы
 */
export function renderHome() {
  if (hasLogged()) {
    route(LINKS.FEED.HREF);
  } else {
    document.body.style.height = "100vh";
    ClearHistoryBrowser();
    const vdom = new VirtualDOM(
      createElement("div", { class: "home-container-sec" }, []),
      createElement("div", { class: "home-overlay" }, []),
      createElement("div", { class: "home-header" }, [createText("PUSHART")]),
      createElement("div", { class: "home-buttons" }, [
        createElement("a", { class: "home-button" }, [createText("Войти")]),
      ]),
    );
    const jsx = "<div class=home-container></div>";
    const container = createElementJSX(jsx);
    const html = render(vdom);

    container.innerHTML = html;

    const button: any = container.querySelector(".home-buttons");
    button.addEventListener("click", () => {
      route(LINKS.LOGIN.HREF);
    });

    if (window.location.pathname !== LINKS.HOME.HREF) {
      route(LINKS.HOME.HREF, window.location.pathname);
    }

    const containerSecond: any = container.querySelector(
      ".home-container-sec",
    ) as HTMLElement;
    if (window.location.pathname == LINKS.HOME.HREF) {
      // Создаем маску для выжигания
      const mask = createMask();

      container.appendChild(mask);

      // Запускаем анимацию с помощью requestAnimationFrame
      function animate() {
        controllerMask(container, containerSecond, mask);
        // Запланировать следующий кадр анимации
        requestAnimationFrame(animate);
      }

      // Начинаем анимацию
      requestAnimationFrame(animate);
    }
    return container;
  }
}
