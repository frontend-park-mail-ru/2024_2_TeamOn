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
import { hideLoader } from "../feed";
import {
  controlActiveLink,
  controlNotification,
  showZeroNotif,
  updateNotifText,
} from "../../features/controlActiveLink/controlActiveLink";

function controlZero() {
  const zero: any = document.querySelector(`.zero-notif`);
}
/**
 * Функция рендера уведомлений
 * @returns
 */
export async function renderNotifications() {
  try {
    if (!sessionStorage.getItem("notification")) {
      sessionStorage.setItem("notification", "0");
    }
    document.body.style.minHeight = "100%";
    const allNotifications: any = [];
    const IsNotReadNotifications: any = [];

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
    setStatic(iconNotificationBig, urlIconNotification);

    const mainContent = container.querySelector(".main-content");

    modifierSidebar(mainContent);
    const tab: any = container.querySelector(`.tab-notification`);

    controlActiveLink(tab, controlNotification);

    const logoutbutton = container.querySelector(
      `.${ELEMENTS_CLASS.LOGOUT.BLOCK}`,
    );

    logoutbutton.addEventListener("click", (event: any) => {
      event.preventDefault();
      removeItemLocalStorage(user.username);
      route(LINKS.HOME.HREF);
    });
    const containerNotificationsAll = container.querySelector(
      ".container-all-notifications",
    );
    const containerNotificationsNotRead = container.querySelector(
      ".container-isnotread-notifications",
    );
    const activeRequests: any = new Set();

    await paginateNotifications(
      activeRequests,
      allNotifications,
      IsNotReadNotifications,
      containerNotificationsAll,
      containerNotificationsNotRead,
    );

    const zero: any = document.querySelector(`.zero-notif`);
    const timeCont =
      sessionStorage.getItem("notification") === "0"
        ? containerNotificationsAll
        : containerNotificationsNotRead;
    if (
      zero &&
      !timeCont.querySelector(".container-notif") &&
      window.location.pathname === "/notifications"
    ) {
      updateNotifText(zero, sessionStorage.getItem("notification"));
      zero.style.display = "flex";
    } else if (container.querySelector(".container-notif")) {
      zero.style.display = "none";
    }

    return container;
  } catch (error) {
    console.log("ERROR");
    throw error;
  } finally {
    hideLoader();
  }
}
export { renderNotification };
