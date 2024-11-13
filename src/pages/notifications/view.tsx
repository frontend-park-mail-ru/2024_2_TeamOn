// import * as VDom from "vdom";
import { Sidebar } from "../feed/view";
import { getAccount } from "../feed/feedView";
import * as VDom from "vdom";
import { createText } from "jsxteamon2/dist/jsxteamon";

export async function notificationContainer() {
  const userdata: any | null = await getAccount();
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      <div class="container-notification">
        <h1>Уведомления</h1>
        <div class="notification-icon">
          <i class="icon-notification-big"></i>
        </div>
        <div class="no-notifications">Уведомлений пока нет</div>
        <div class="notification-text">
          Вы будете получать уведомления о новых участниках сообщества,
          действиях с вашими публикациями и других событиях.
        </div>
      </div>
    </div>
  );
}
