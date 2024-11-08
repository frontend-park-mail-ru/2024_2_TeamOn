import { ELEMENTS_CLASS, LINKS, state } from "../../consts";
import { pageContainer } from "../../index";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { VNode } from "../../lib/vdom/src/source";
import { route } from "../../utils/routing";
import { removeItemLocalStorage } from "../../utils/storages";
import { modifierSidebar } from "../feed/feed";
import { getAccount, renderSidebar } from "../feed/feedView";
/**
 * Функция рендера уведомлений (в обработке)
 * @returns
 */
export async function renderNotifications() {
  try {
    const user: any = state.currentUser;
    const userdata: any | null = await getAccount();

    const vdom: VNode = createElement("div", { class: "main-content" }, [
      await renderSidebar(userdata),
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

    const mainContent = container.querySelector(".main-content");

    modifierSidebar(mainContent);

    const logoutbutton = container.querySelector(
      `.${ELEMENTS_CLASS.LOGOUT.BLOCK}`,
    );

    logoutbutton.addEventListener("click", (event: any) => {
      event.preventDefault();
      removeItemLocalStorage(user.username);
      route(LINKS.HOME.HREF);
    });
    return container;
  } catch (error) {
    console.log("ERROR");
    throw error;
  }
}
