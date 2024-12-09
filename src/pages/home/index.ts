import { ELEMENTS_CLASS, LINKS } from "../../shared/consts/consts";
import { route } from "../../shared/routing/routing";
import { hasLogged } from "../../shared/utils/hasLogged";
import { clearHistoryBrowser } from "../../shared/utils/clearHistory";
import {
  pageContainer,
  urlHomeContainer,
  urlHomeContainerSec,
} from "../../app/index";
import { update } from "../../../lib/vdom/lib";
import {
  controllerMask,
  createMask,
} from "../../shared/utils/utilsView/circle";
import { VNode } from "../../../lib/vdom/src/source";
import { containerHome } from "./ui/home";

import { showSearch } from "../../entities/searchbar/index";
import { setTitle } from "../../shared/settitle/setTitle";
import { setStatic } from "../../shared/getStatic/getStatic";
import { hideLoader } from "../feed";

/**
 * Обработка домашней страницы
 */
export async function renderHome() {
  try {
    sessionStorage.clear();
    if (hasLogged()) {
      route(LINKS.FEED.HREF);
    } else {
      setTitle(LINKS.HOME.TEXT);
      document.body.style.height = "100vh";
      clearHistoryBrowser();

      const vdom: VNode = containerHome();

      const container = update(pageContainer, vdom);

      const homeContainer: any = container.querySelector(`.home-container`);
      setStatic(homeContainer, urlHomeContainer);
      const homeContainerSec: any =
        container.querySelector(`.home-container-sec`);
      setStatic(homeContainerSec, urlHomeContainerSec);
      if (window.innerWidth <= 768) {
        setStatic(homeContainer, urlHomeContainerSec);
      }
      const button: any = container.querySelector(
        `.${ELEMENTS_CLASS.HOME_BUTTONS.BLOCK}`,
      );
      button.addEventListener("click", () => {
        route(LINKS.LOGIN.HREF);
      });
      const buttonFeed: any = container.querySelector(
        `.${ELEMENTS_CLASS.FEED_BUTTONS.BLOCK}`,
      );
      buttonFeed.addEventListener("click", () => {
        route(LINKS.FEED.HREF);
      });

      if (window.location.pathname !== LINKS.HOME.HREF) {
        route(LINKS.HOME.HREF, window.location.pathname);
      }

      const containerSecond: any = container.querySelector(
        `.${ELEMENTS_CLASS.HOME.HOME_CONTAINER_SEC}`,
      ) as HTMLElement;

      showSearch(container);
      if (
        window.location.pathname == LINKS.HOME.HREF &&
        window.innerWidth >= 1024
      ) {
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
  } catch (error) {
    console.error("Error in home");
  } finally {
    hideLoader();
  }
}
