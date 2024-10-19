import { RouterLinks } from "../consts";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts";
import { route } from "../utils/routing";
import { hasLogged } from "../utils/hasLogged";
import { ClearHistoryBrowser } from "../utils/clearHistory";
import { VirtualDOM } from "../lib/vdom/src/source";
import { createElement, createText, render } from "../lib/vdom/lib";
import { JSXParser } from "../lib/jsx/src/source";
import { createElementJSX } from "../lib/jsx/lib";
import { renderSlidebar } from "./feed/feedView";

/**
 * Обработка домашней страницы
 */
export function renderHome() {
  if (hasLogged()) {
    route(RouterLinks.FEED);
  } else {
    document.body.style.height = "100vh";
    ClearHistoryBrowser();
    const vdom = new VirtualDOM(
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
      route(RouterLinks.LOGIN);
    });

    return container;
  }
}
