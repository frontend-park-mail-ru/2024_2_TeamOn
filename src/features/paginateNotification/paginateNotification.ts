import { ELEMENTS_CLASS, QUERY } from "../../shared/consts/consts";
import { renderTo, update } from "../../../lib/vdom/lib";
import { convertISOToRussianDate } from "../../shared/utils/parsedate";
import { getAvatar } from "../getavatar/getavatar";
import { gotoauthor } from "../../shared/gotoauthor/gotoauthor";
import { getNotification } from "../getNotification/getNotification";
import { containerNotification } from "../../widgest/notification/notification";
import { parseUsername } from "../parseUsername/parseUsername";
/**
 * Инициализация компонентов уведомлений
 * @param container - корневой контейнер
 * @param user - текущий пользователь
 */
async function customizeNotification(container: any, content: any = null) {
  const authorSection: any = container.querySelector(
    `.${ELEMENTS_CLASS.NOTIFICATION.AUTHOR.NAME}`,
  );

  const avatar: any = container.querySelector(
    `.${ELEMENTS_CLASS.NOTIFICATION.AUTHOR.AVATAR}`,
  );
  if (avatar) {
    avatar.alt = "Аватар автора";
    avatar.height = 50;
    const avatarload: any = await getAvatar(
      window.location.pathname,
      content.authorId,
    );
    avatar.src = avatarload;
    avatar.width = 50;
  }
  const authorName: any = container.querySelector(
    `.${ELEMENTS_CLASS.NOTIFICATION.AUTHOR.NAME}`,
  );
  if (authorName) {
    authorName.textContent = content.authorUsername;
  }
  if (authorSection) {
    authorSection.addEventListener("click", () => {
      gotoauthor(content.authorId);
    });
  }

  const title: any = container.querySelector(
    `.${ELEMENTS_CLASS.NOTIFICATION.TITLE}`,
  );
  title.textContent = content.title;

  const date: any = container.querySelector(`.${ELEMENTS_CLASS.POST.DATE}`);
  date.textContent = convertISOToRussianDate(content.createdAt);
}
async function modifyNotifications(
  container: any,
  notifications: any,
  status: string,
) {
  try {
    const filteredNotifications =
      status === "NOTREAD"
        ? notifications.filter(
            (notification: any) => notification.status === "NOTREAD",
          )
        : notifications;

    if (filteredNotifications.length > 0) {
      const containers = container.querySelectorAll(
        `.${ELEMENTS_CLASS.NOTIFICATION.BLOCK}`,
      );
      await Promise.all(
        Array.from(containers)
          .slice(-filteredNotifications.length)
          .map((container: any, index: any) => {
            return customizeNotification(
              container,
              filteredNotifications[filteredNotifications.length - 1 - index],
            );
          }),
      );
    }
  } catch (error) {
    console.log("ERROR");
    throw error;
  }
}

/**
 * Рендерит список уведомлений с учетом их статуса.
 * @param notifications - массив уведомлений
 */
async function renderNotifications(notifications: any[]) {
  const notificationsPromises = notifications.map(async (notification: any) => {
    const container = await containerNotification(notification);
    // const statusClass = notification.isRead ? "read" : "unread";
    // кутвук.classList.add(statusClass);

    const username = parseUsername(notification.message);
    if (username) {
      console.log(`Имя пользователя: ${username}`);
    }
    const div = renderTo(container);
    return div;
  });

  // Ожидаем выполнения всех промисов
  return await Promise.all(notificationsPromises);
}

async function paginateNotifications(
  allNotifications: any[],
  containerNotifications: HTMLElement,
) {
  let stopLoadNotifications = false;
  let offset = 0;
  let isLoading = false;

  const activeRequests = new Set();
  async function loadNotifications() {
    if (isLoading || stopLoadNotifications) return;
    isLoading = true;

    try {
      const requestId = `notifications-${offset}`;
      if (activeRequests.has(requestId)) return;
      activeRequests.add(requestId);
      const notifications: any = await getNotification(offset);
      const nextNotifications = notifications.slice(0, QUERY.LIMIT);

      if (nextNotifications.length > 0) {
        allNotifications.push(...nextNotifications);
        offset += QUERY.LIMIT;
        const notificationElements =
          await renderNotifications(nextNotifications);
        containerNotifications.append(...notificationElements);
      } else {
        stopLoadNotifications = true;
      }

      activeRequests.delete(requestId);
    } finally {
      isLoading = false;
    }
  }

  await loadNotifications();

  window.addEventListener("scroll", async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      await loadNotifications();
    }
  });
}

export { paginateNotifications };
