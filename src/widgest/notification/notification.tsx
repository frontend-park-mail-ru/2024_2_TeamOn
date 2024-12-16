import * as VDom from "vdom";
/**
 * Рендер контейнера поста
 * @param post Пост
 * @param mediaContent Медиа-контент у поста
 * @returns
 */
async function containerNotification(notification: any) {
  const flag = notification.isRead ? "readed" : "";
  const standartClass = "post-container notif-container " + flag;

  return (
    <div class="container-notif">
      <div
        class={standartClass}
        data-notification-id={notification.notificationID}
      >
        <div
          class="info-section"
          style="display: flex; align-items: flex-start;"
        >
          <div class="header-post" style="display: flex">
            <div class="author-section" style="padding-top: 10px;">
              <img class="author-avatar avatar notif-avatar"></img>
            </div>
          </div>
          <div
            class="general-info-notif"
            style="display: flex;
              flex-direction: column;
              justify-content: space-between;"
          >
            <div class="title-notif" style="font-weight: normal; margin-left">
              {notification.message}
            </div>
            <div class="date" style="text-align: left;">
              {notification.createdAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { containerNotification };
