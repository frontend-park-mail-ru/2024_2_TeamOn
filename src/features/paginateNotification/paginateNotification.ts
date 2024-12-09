import { ELEMENTS_CLASS, LINKS, QUERY } from "../../shared/consts/consts";
import { getPopularPosts } from "../getPopularPosts/getPopularPosts";
import { getRecentlyPosts } from "../getRecentlyPosts/getRecentlyPosts";
import { containerPost } from "../../widgest/feed";
import { renderTo, update } from "../../../lib/vdom/lib";
import { AddLikeOnPost } from "../../entities/likes";
import { convertISOToRussianDate } from "../../shared/utils/parsedate";
import { route } from "../../shared/routing/routing";
import { getAvatar } from "../getavatar/getavatar";
import { containerMediaPost } from "../../widgest/feed/ui/post/post";
import { hasLogged } from "../../shared/utils/hasLogged";
import { gotoauthor } from "../../shared/gotoauthor/gotoauthor";
import { showOverlay } from "../../shared/overlay/overlay";
import { renderComplaintPost } from "../../pages/feed/ui/feed";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { setStatic } from "../../shared/getStatic/getStatic";
import { urlIconLike } from "../../app";
import { renderNotification } from "../../pages/notifications";
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

    const statusClass = notification.isRead ? "read" : "unread";
    container.classList.add(statusClass);

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
  allNotifications: any[], // Все уведомления, которые будем загружать
  containerNotifications: HTMLElement, // Контейнер для уведомлений
) {
  let stopLoadNotifications = false; // Переменная для остановки загрузки уведомлений
  let offset = 0; // Сдвиг для пагинации
  let isLoading = false; // Флаг, чтобы не загружать одновременно несколько запросов

  const activeRequests = new Set(); // Набор для отслеживания активных запросов

  // Функция для загрузки уведомлений
  async function loadNotifications() {
    if (isLoading || stopLoadNotifications) return; // Если загрузка идет или стоп-флаг активирован, не выполняем запрос
    isLoading = true; // Устанавливаем флаг загрузки

    try {
      const requestId = `notifications-${offset}`; // Уникальный идентификатор запроса
      if (activeRequests.has(requestId)) return; // Проверка, есть ли активный запрос для этого offset
      activeRequests.add(requestId); // Добавляем запрос в активные

      // Получаем уведомления с бэкенда
      const notifications: any = await getNotification(offset);
      const nextNotifications = notifications.slice(0, QUERY.LIMIT); // Ограничиваем количество уведомлений

      if (nextNotifications.length > 0) {
        allNotifications.push(...nextNotifications); // Добавляем новые уведомления в общий список
        offset += QUERY.LIMIT; // Обновляем сдвиг для следующей порции

        // Рендерим уведомления и добавляем их в DOM
        const notificationElements =
          await renderNotifications(nextNotifications);
        containerNotifications.append(...notificationElements);
      } else {
        stopLoadNotifications = true; // Если уведомлений больше нет, останавливаем загрузку
      }

      activeRequests.delete(requestId); // Удаляем запрос из активных
    } finally {
      isLoading = false; // Сбрасываем флаг загрузки
    }
  }

  // Инициализация загрузки уведомлений
  await loadNotifications();

  // Обработчик события прокрутки
  window.addEventListener("scroll", async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      // Если прокрутка близка к низу страницы
      await loadNotifications(); // Загружаем новые уведомления
    }
  });
}

export { paginateNotifications };
