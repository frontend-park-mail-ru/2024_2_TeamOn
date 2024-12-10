import * as VDom from "vdom";
import { hasLogged } from "../../shared/utils/hasLogged";
/**
 * Рендер контейнера поста
 * @param post Пост
 * @param mediaContent Медиа-контент у поста
 * @returns
 */
async function containerNotification(notification: any) {
  const flag: string = hasLogged() ? "display: block" : "display: none";
  return (
    <div>
      <div class="post-container">
        <div class="header-post" style="display: flex">
          <div class="author-section">
            <img class="author-avatar avatar"></img>
            <div class="info-post-section">
              <div class="author-name"></div>
              <div class="date"></div>
            </div>
          </div>
        </div>
        <div class="title">{notification.message}</div>
        <div class="content">{notification.createdAt}</div>
      </div>
    </div>
  );
}

export { containerNotification };
