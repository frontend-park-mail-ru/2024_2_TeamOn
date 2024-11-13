import { ELEMENTS_CLASS, LINKS, state } from "../../consts";
import { pageContainer } from "../../index";
import { update } from "../../../lib/vdom/lib";
import { route } from "../../utils/routing";
import { removeItemLocalStorage } from "../../utils/storages";
import { modifierSidebar } from "../feed";
import { notificationContainer } from "./ui/notifications";
/**
 * Функция рендера уведомлений (в обработке)
 * @returns
 */
export async function renderNotifications() {
  try {
    const user: any = state.currentUser;

    const vdom = await notificationContainer();

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
