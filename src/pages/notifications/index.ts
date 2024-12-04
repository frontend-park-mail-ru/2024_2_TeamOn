import { ELEMENTS_CLASS, LINKS, state } from "../../shared/consts/consts";
import { pageContainer, urlIconNotification } from "../../app/index";
import { update } from "../../../lib/vdom/lib";
import { route } from "../../shared/routing/routing";
import { removeItemLocalStorage } from "../../shared/utils/storages";
import { notificationContainer } from "./ui/notifications";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { setTitle } from "../../shared/settitle/setTitle";
import { setStatic } from "../../shared/getStatic/getStatic";
import { hideLoader, showLoader } from "../feed";
/**
 * Функция рендера уведомлений (в обработке)
 * @returns
 */
export async function renderNotifications() {
  try {
    showLoader();
    setTitle(LINKS.NOTIFICATIONS.TEXT);
    const user: any = state.currentUser;

    const vdom = await notificationContainer();

    const container = update(pageContainer, vdom);

    const iconNotification = container.querySelector(`.icon-notification`);
    setStatic(iconNotification, urlIconNotification);

    const iconNotificationBig = container.querySelector(
      `.icon-notification-big`,
    );
    setStatic(iconNotificationBig, urlIconNotification);

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
  } finally {
    hideLoader();
  }
}
