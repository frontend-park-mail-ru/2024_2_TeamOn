import { ELEMENTS_CLASS, LINKS, state } from "../../consts";
import { pageContainer } from "../../index";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { VNode } from "../../lib/vdom/src/source";
import { findUsername } from "../../utils/hasLogged";
import { route } from "../../utils/routing";
import { customizeSidebar } from "../feed/feed";
import { renderSidebar } from "../feed/feedView";
import { getCurrentUser, renderLogoutButton } from "../profile/profile";

export async function renderNotifications() {
  try {
    const user: any | null = await getCurrentUser(window.location.pathname);
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    const doc: any = document.body;
    doc.style.height = "100%";

    state.currentUser = user;

    const vdom: VNode = createElement("div", {}, [
      renderSidebar(),
      createElement("div", { class: ELEMENTS_CLASS.NOTIFICATION.BLOCK }, [
        createElement("h1", {}, [createText("Уведомления")]),
        createElement("div", { class: ELEMENTS_CLASS.NOTIFICATION.ELEMENT }, [
          createElement(
            "i",
            { class: ELEMENTS_CLASS.NOTIFICATION.MODIFIER.bigICON },
            [],
          ),
        ]),
        createElement(
          "div",
          { class: ELEMENTS_CLASS.NOTIFICATION.MODIFIER.noNOTIFICATIONS },
          [createText("Уведомлений пока нет")],
        ),
        createElement(
          "div",
          { class: ELEMENTS_CLASS.NOTIFICATION.MODIFIER.TEXT },
          [
            createText(
              "Вы будете получать уведомления о новых участниках сообщества, действиях с вашими публикациями и других событиях.",
            ),
          ],
        ),
      ]),
    ]);
    const container = update(pageContainer, vdom);

    const sidebar: any = container.querySelector(
      `.${ELEMENTS_CLASS.SIDEBAR.ELEMENT}`,
    );
    sidebar.appendChild(customizeSidebar(sidebar));

    const userF: any = findUsername();

    if (userF) {
      sidebar.appendChild(renderLogoutButton(userF));
    } else {
      route(LINKS.HOME.HREF);
    }

    return container;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}
