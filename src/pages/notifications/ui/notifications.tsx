import { Sidebar } from "../../../shared/sidebar/sidebar";
import * as VDom from "vdom";
import { modal } from "../../../pages/feed/ui/feed";

export async function renderNotification() {
  let flagFirst: string =
    sessionStorage.getItem(`notification`) === "0" ||
    !sessionStorage.getItem(`notification`)
      ? `display: flex;`
      : "display: none;";

  let flagSec: string =
    sessionStorage.getItem(`notification`) === "1"
      ? `display: flex;`
      : "display: none;";

  return (
    <div class="main-content">
      {await Sidebar()}
      <div class="container-notification main-container-notification">
        <h1>Уведомления</h1>
        <div class="tabs settings tab-notification">
          <a
            class="active all-notifications"
            style="font-size: 20px; max-width: 700px;"
          >
            Все уведомления
          </a>
          <a
            class="isnotread-notifications"
            style="font-size: 20px; max-width: 700px;"
          >
            Непрочитанные
          </a>
        </div>
      </div>
      <div class="container-all-notifications" style={flagFirst}>
        <div class="new-notif-all"></div>
      </div>
      <div class="container-isnotread-notifications" style={flagSec}>
        <div class="new-notif-notread"></div>
      </div>
      <div
        class="zero-notif"
        style="    flex-direction: column;
    text-align: center; display: flex;"
      >
        <div
          class="notification-icon"
          style="display: flex;
    align-items: center;
    justify-content: center;"
        >
          <i class="icon-notification-big"></i>
        </div>
        <div
          class="no-notifications"
          style="    font-size: 20px;
    margin-bottom: 10px;"
        >
          Уведомлений пока нет
        </div>
        <div class="notification-text">
          Вы будете получать уведомления о новых участниках сообщества,
          действиях с вашими публикациями и других событиях.
        </div>
      </div>
      <div class="modal-view-photos" style="display: none; z-index=10101010">
        {modal()}
      </div>
    </div>
  );
}
