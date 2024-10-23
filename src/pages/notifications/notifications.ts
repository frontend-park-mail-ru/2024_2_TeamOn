import { state } from "../../consts";
import { renderSidebar } from "../feed/feedView";
import { getCurrentUser } from "../profile/profile";

export async function renderNotifications() {
  try {
    const user: any | null = await getCurrentUser();
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    const doc: any = document.body;
    doc.style.height = "100%";

    state.currentUser = user;

    const sidebar: any = renderSidebar();
    const main: any = document.createElement("div");
    const mainContent: any = document.createElement("div");
    mainContent.className = "container-notification";
    const h1: any = document.createElement("h1");
    h1.textContent = "Уведомления";
    const containerIcon: any = document.createElement("div");
    containerIcon.className = "notification-icon";

    const i: any = document.createElement("i");
    i.className = "icon-notification-big";

    const containerSec: any = document.createElement("div");
    containerSec.className = "no-notifications";
    containerSec.textContent = "Уведомлений пока нет";

    const containerText: any = document.createElement("div");
    containerText.className = "notification-text";
    containerText.textContent =
      "Вы будете получать уведомления о новых участниках сообщества, действиях с вашими публикациями и других событиях.";

    main.appendChild(sidebar);
    mainContent.appendChild(h1);
    mainContent.appendChild(containerIcon);
    containerIcon.appendChild(i);
    mainContent.appendChild(containerSec);
    mainContent.appendChild(containerText);
    main.appendChild(mainContent);

    return main;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}
