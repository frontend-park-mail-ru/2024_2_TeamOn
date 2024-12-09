//текст уведомления
// прочитано
// всплывающие уведомления
import { ELEMENTS_CLASS, LINKS, state } from "../../shared/consts/consts";
import { pageContainer, urlIconNotification } from "../../app/index";
import { update } from "../../../lib/vdom/lib";
import { route } from "../../shared/routing/routing";
import { removeItemLocalStorage } from "../../shared/utils/storages";
import { renderNotification } from "./ui/notifications";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { setTitle } from "../../shared/settitle/setTitle";
import { setStatic } from "../../shared/getStatic/getStatic";
import { convertISOToRussianDate } from "../../shared/utils/parsedate";
import { gotoauthor } from "../../shared/gotoauthor/gotoauthor";
import { paginateNotifications } from "../../features/paginateNotification/paginateNotification";


/**
 * Функция рендера уведомлений
 * @returns
 */
export async function renderNotifications() {
  try {
    const allNotifications: any = [];
    setTitle(LINKS.NOTIFICATIONS.TEXT);
    const user: any = state.currentUser;
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const vdom = await renderNotification();

    const container = update(pageContainer, vdom);

    const iconNotification = container.querySelector(`.icon-notification`);
    setStatic(iconNotification, urlIconNotification);

    const iconNotificationBig = container.querySelector(
      `.icon-notification-big`,
    );
    const containerNotifications = container.querySelector(
      ".main-container-notification",
    );
    setStatic(iconNotificationBig, urlIconNotification);

    const mainContent = container.querySelector(".main-content");

    modifierSidebar(mainContent);
    //const toggleButton: any = container.querySelector(".toggleButton");

    const logoutbutton = container.querySelector(
      `.${ELEMENTS_CLASS.LOGOUT.BLOCK}`,
    );

    logoutbutton.addEventListener("click", (event: any) => {
      event.preventDefault();
      removeItemLocalStorage(user.username);
      route(LINKS.HOME.HREF);
    });
    await paginateNotifications(allNotifications, containerNotifications);
    return container;
  } catch (error) {
    console.log("ERROR");
    throw error;
  } finally {
    hideLoader();
  }
}
export { renderNotification };
