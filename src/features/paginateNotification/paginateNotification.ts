import { ELEMENTS_CLASS, QUERY } from "../../shared/consts/consts";
import { renderTo, update } from "../../../lib/vdom/lib";
import { convertISOToRussianDate } from "../../shared/utils/parsedate";
import { getAvatar } from "../getavatar/getavatar";
import { gotoauthor } from "../../shared/gotoauthor/gotoauthor";
import { getNotification } from "../getNotification/getNotification";
import { containerNotification } from "../../widgest/notification/notification";
import { parseUsername } from "../parseUsername/parseUsername";
import { controlSlideShow } from "../paginateFeed/paginateFeed";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { throttle } from "../../entities/searchbar";
function formatMessage(message: any) {
  // Регулярное выражение для поиска ника
  const regex = /@(\w+)/;
  return message.replace(
    regex,
    '<a class="user-mention" data-username="$1">$1</a>',
  );
}
export function formatMessage2(message: any) {
  // Регулярное выражение для поиска ника
  const regex = /@(\w+)/;
  const regexAfterColon = /:(.*)/;

  // Заменяем ник на ссылку
  message = message.replace(
    regex,
    '<a class="user-mention" data-username="$1">$1</a>',
  );

  // Заменяем текст после двоеточия на курсив
  message = message.replace(
    regexAfterColon,
    (match: any, p1: any) => `: <em>${p1.trim()}</em>`,
  );

  return message;
}
/**
 * Инициализация компонентов уведомлений
 * @param container - корневой контейнер
 * @param user - текущий пользователь
 */
async function customizeNotification(container: any, notification: any = null) {
  if (!notification) return;

  const message: any = container.querySelector(`.title-notif`);

  const parseMessage = formatMessage2(notification.message);
  message.innerHTML = parseMessage;

  const username = container.querySelector(`.user-mention`);

  if (!parseMessage.includes("Пользователь")) {
    username.addEventListener("click", () => {
      gotoauthor(notification.senderID);
    });
    username.classList.add("author");
  }

  const rightContent: any = document.querySelector(`.container-notification`);
  controlSlideShow(container, rightContent);
}

/**
 * Рендерит список уведомлений с учетом их статуса.
 * @param notifications - массив уведомлений
 */
export async function renderNotifications(notifications: any[]) {
  const notificationsPromises = notifications.map(async (notification: any) => {
    const container = await containerNotification(notification);

    const div = renderTo(container);

    const avatarImage: any = div.querySelector(`.author-avatar`);
    const avatarLoad: any = await getAvatar(
      window.location.pathname,
      notification.senderID,
    );
    avatarImage.src = avatarLoad;
    avatarImage.height = 50;
    avatarImage.width = 50;

    return div;
  });

  // Ожидаем выполнения всех промисов
  return await Promise.all(notificationsPromises);
}
/**
 * Получаем посты пользователя через объект типа промис
 * @param link Ссылка на страницу
 * @param offset Оффсет
 * @param limit Лимит
 * @returns
 */
async function markIsRead(notificationID: string, el: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/accounts/notification/status/update`,
      { notificationID: notificationID },
      (response) => {
        if (response.ok) {
          el.classList.add("readed");
          resolve(true);
        } else if (response.status === 400) {
          reject("Пост не найден");
        } else if (response.status === 500) {
          reject("Сервер не ответил вовремя. Попробуйте позже.");
        } else {
          resolve(false);
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
const keys = new Set();

export async function modifireNotifications(
  containerAllNotifications: any,
  containerIsNotReadNotifications: any,
  AllNotifications: any,
  IsNotReadNotifications: any,
) {
  try {
    // Обработка всех уведомлений
    if (AllNotifications && AllNotifications.length > 0) {
      const allcontainersNotif: any =
        containerAllNotifications.querySelectorAll(`.notif-container`);
      console.log(allcontainersNotif, "OBSERV allcontainersNotif");
      const handleIntersection = async (entry: any) => {
        if (entry.isIntersecting) {
          const notificationElement = entry.target;
          const notificationId = notificationElement.dataset.notificationId;
          const notificationIndex =
            Array.from(allcontainersNotif).indexOf(notificationElement);

          if (AllNotifications[notificationIndex]) {
            if (!AllNotifications[notificationIndex].isCustomized) {
              if (!AllNotifications[notificationIndex].isRead) {
                try {
                  const response: any = await markIsRead(
                    notificationId,
                    notificationElement,
                  );
                  if (response) {
                    AllNotifications[notificationIndex].isRead = true;
                    notificationElement.classList.add("readed");
                  }
                } catch (error) {
                  console.error(
                    `Ошибка при пометке уведомления ${notificationId} как прочитанного:`,
                    error,
                  );
                }
              }
              customizeNotification(
                notificationElement,
                AllNotifications[notificationIndex],
              );
              AllNotifications[notificationIndex].isCustomized = true;
            }
          }
        }
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(handleIntersection);
      });

      allcontainersNotif.forEach((notif: any, index: number) => {
        observer.observe(notif);
      });
    }

    // Обработка непрочитанных уведомлений
    if (IsNotReadNotifications && IsNotReadNotifications.length > 0) {
      const allcontainersIsNotReadNotif: any =
        containerIsNotReadNotifications.querySelectorAll(`.notif-container`);
      console.log(
        allcontainersIsNotReadNotif,
        "OBSERV allcontainersIsNotReadNotif",
      );
      const handleIntersectionNotRead = async (entry: any) => {
        if (entry.isIntersecting) {
          const notificationElement = entry.target;
          const notificationId = notificationElement.dataset.notificationId;
          const notificationIndex = Array.from(
            allcontainersIsNotReadNotif,
          ).indexOf(notificationElement);

          if (IsNotReadNotifications[notificationIndex]) {
            // Проверяем, было ли уведомление уже кастомизировано
            if (!IsNotReadNotifications[notificationIndex].isCustomized) {
              if (!IsNotReadNotifications[notificationIndex].isRead) {
                try {
                  const response: any = await markIsRead(
                    notificationId,
                    notificationElement,
                  );
                  if (response) {
                    IsNotReadNotifications[notificationIndex].isRead = true;
                    notificationElement.classList.add("readed");
                  }
                } catch (error) {
                  console.error(
                    `Ошибка при пометке уведомления ${notificationId} как прочитанного:`,
                    error,
                  );
                }
              }
              customizeNotification(
                notificationElement,
                IsNotReadNotifications[notificationIndex],
              );
              IsNotReadNotifications[notificationIndex].isCustomized = true;
            }
          }
        }
      };

      const observerNotRead = new IntersectionObserver((entries) => {
        entries.forEach(handleIntersectionNotRead);
      });

      allcontainersIsNotReadNotif.forEach((notif: any, index: number) => {
        observerNotRead.observe(notif);
      });
    }
  } catch (error) {
    console.log("ERROR in modifireNotifications in notifications");
    throw error;
  }
}

async function paginateNotifications(
  activeRequests: any,
  allNotifications: any,
  IsNotReadNotifications: any,
  containerNotificationsAll: any,
  containerNotificationsNotRead: any,
  pushVariable: any = null,
) {
  let stopLoadAllNotifications = false;
  let stopLoadIsNotReadNotifications = false;
  let offsetAll = 0;
  let offsetIsNotRead = 0;
  let isLoading = false;

  async function loadNotifications() {
    if (isLoading) return;
    isLoading = true;

    const activeLinkNotification = sessionStorage.getItem("notification");
    activeLinkNotification == "0"
      ? (stopLoadAllNotifications = false)
      : (stopLoadIsNotReadNotifications = false);

    try {
      if (activeLinkNotification == "0" && !stopLoadAllNotifications) {
        const requestId = `allnotifications-${offsetAll}`;
        if (activeRequests.has(requestId)) return;
        activeRequests.add(requestId);
        let notifications: any =
          pushVariable || (await getNotification(offsetAll));
        const nextAllNotifications = notifications.slice(0, QUERY.LIMIT);

        if (nextAllNotifications && nextAllNotifications.length > 0) {
          allNotifications.push(...nextAllNotifications);
          offsetAll += QUERY.LIMIT;
          const notificationElements =
            await renderNotifications(nextAllNotifications);
          containerNotificationsAll.append(...notificationElements);
          modifireNotifications(
            containerNotificationsAll,
            containerNotificationsNotRead,
            nextAllNotifications,
            [],
          );
        } else {
          stopLoadAllNotifications = true;
        }
      }

      if (activeLinkNotification == "1" && !stopLoadIsNotReadNotifications) {
        const requestId = `notreadnotifications-${offsetIsNotRead}`;
        if (activeRequests.has(requestId)) return;
        activeRequests.add(requestId);
        let IsNotnotifications: any =
          pushVariable ||
          (await getNotification(offsetIsNotRead, "notread", 300));
        const nextIsNotNotifications = IsNotnotifications.slice(0, QUERY.LIMIT);

        if (nextIsNotNotifications && nextIsNotNotifications.length > 0) {
          IsNotReadNotifications.push(...nextIsNotNotifications);
          offsetIsNotRead += QUERY.LIMIT;
          const notificationElements = await renderNotifications(
            nextIsNotNotifications,
          );

          containerNotificationsNotRead.append(
            ...notificationElements.reverse(),
          );
          modifireNotifications(
            containerNotificationsAll,
            containerNotificationsNotRead,
            [],
            nextIsNotNotifications,
          );
        } else {
          stopLoadIsNotReadNotifications = true;
        }
      }
    } finally {
      isLoading = false; // Сбрасываем флаг загрузки
    }
  }

  await loadNotifications();
  // Обработчик события прокрутки
  let isLoadingOnScroll = false;
  window.addEventListener("scroll", async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    // Проверяем, достиг ли пользователь нижней части страницы
    if (scrollHeight - scrollTop <= clientHeight + 100 && !isLoadingOnScroll) {
      isLoadingOnScroll = true;
      await loadNotifications();
      isLoadingOnScroll = false;
    }
  });
}

export { paginateNotifications };
