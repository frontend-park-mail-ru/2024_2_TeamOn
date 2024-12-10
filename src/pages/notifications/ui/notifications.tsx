// import * as VDom from "vdom";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { getAccount } from "../../../features/getAccount/getAccount";
import * as VDom from "vdom";
import { createText } from "jsxteamon2/dist/jsxteamon";
import { renderNotifications } from "../index";
export async function renderNotification() {
  return (
    <div class="main-content">
      {await Sidebar()}
      <div class="container-notification main-container-notification">
        <h1>Уведомления</h1>
        <div class="notification-icon">
          <i class="icon-notification-big"></i>
          {/* <div class="author-section">
            <img class="author-avatar avatar"></img>
            <div class="info-post-section">
              <div class="author-name"></div>
              <div class="date"></div>
            </div>
          </div>*/}
        </div>
      </div>
      {/*<div class="no-notifications">Уведомлений пока нет</div>*/}
      {/*<div class="notification-text">
          Вы будете получать уведомления о новых участниках сообщества,
          действиях с вашими публикациями и других событиях.*/}
    </div>
  );
}
