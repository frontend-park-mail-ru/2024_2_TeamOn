// import * as VDom from "vdom";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { getAccount } from "../../../features/getAccount/getAccount";
import * as VDom from "vdom";
import { createText } from "jsxteamon2/dist/jsxteamon";

export async function notificationContainer() {
  return (
    <div class="main-content">
      {await Sidebar()}
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
