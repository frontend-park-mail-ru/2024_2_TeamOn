import { iconNotificationHave } from "../../app";
import { getPushNotification } from "../../features/getNotification/getNotification";
import { getAvatar } from "../../features/getavatar/getavatar";
import {
  formatMessage2,
  modifireNotifications,
  renderNotifications,
} from "../../features/paginateNotification/paginateNotification";
import { setStatic } from "../getStatic/getStatic";
import { hasLogged } from "../utils/hasLogged";

let notifications: any = [];
let totalNotificationsCount = notifications.length; // Общее количество уведомлений

async function generateNewNotification() {
  const containerNotificationsAll = document.querySelector(
    ".container-all-notifications",
  );
  const containerNotificationsNotRead = document.querySelector(
    ".container-isnotread-notifications",
  );

  notifications = await getPushNotification();
  const iconNotif: any = document.querySelector(`.icon-notification`);
  if (notifications.length !== 0) {
    setStatic(iconNotif, iconNotificationHave);
  }
  if (
    notifications.length !== 0 &&
    containerNotificationsAll &&
    containerNotificationsNotRead &&
    window.location.pathname === "/notifications"
  ) {
    const notificationElements = await renderNotifications(notifications);

    if (notificationElements.length > 0) {
      containerNotificationsAll.prepend(...notificationElements);
      containerNotificationsNotRead.prepend(...notificationElements);
    }

    modifireNotifications(
      containerNotificationsAll,
      containerNotificationsNotRead,
      notifications.reverse(),
      notifications.reverse(),
      "push",
    );
  }
}

async function controlPush(objSettings: any = null, flag = "") {
  const placeModal: any = document.querySelector(`.placemodal`);
  placeModal.innerHTML = "";

  const maxNotifications = 3;
  const displayedNotifications = notifications.slice(0, maxNotifications);

  // Обновляем общее количество уведомлений
  totalNotificationsCount = notifications.length;

  // Отображаем только первые 3 уведомления
  for (const notification of displayedNotifications) {
    const container2 = document.createElement("div");
    container2.classList.add("push-modal");

    const divSection = document.createElement("div");
    divSection.classList.add("section-push");

    const messageElement = document.createElement("div");
    messageElement.classList.add("message-push", "content");
    messageElement.innerHTML = formatMessage2(notification.message);

    const close = document.createElement("div");
    close.classList.add("close");
    close.textContent = "X";

    const avatarElement: any = document.createElement("img");
    avatarElement.classList.add("avatar-push");
    avatarElement.src = await getAvatar("/feed", notification.senderID);
    avatarElement.width = 50;
    avatarElement.height = 50;

    divSection.appendChild(avatarElement);
    divSection.appendChild(messageElement);
    container2.appendChild(divSection);
    container2.appendChild(close);
    placeModal.appendChild(container2);

    close.addEventListener("click", () => {
      container2.remove();
      notifications = notifications.filter(
        (n: any) => n.notificationID !== notification.notificationID,
      );
      checkForAdditionalMessage();
      controlPush(); // Обновляем интерфейс
    });

    // Логика для таймера и наведения
    let timeoutId = setTimeout(() => {
      container2.remove();
      notifications = notifications.filter(
        (n: any) => n.notificationID !== notification.notificationID,
      );
      checkForAdditionalMessage();
    }, 30000);

    container2.addEventListener("mouseenter", () => {
      clearTimeout(timeoutId);
    });

    container2.addEventListener("mouseleave", () => {
      timeoutId = setTimeout(() => {
        container2.remove();
        notifications = notifications.filter(
          (n: any) => n.notificationID !== notification.notificationID,
        );
        checkForAdditionalMessage();
      }, 30000);
    });
  }

  // Если есть дополнительные уведомления, добавляем сообщение
  if (totalNotificationsCount > maxNotifications) {
    let additionalMessage = placeModal.querySelector(`.message-info`);
    if (!additionalMessage) {
      additionalMessage = document.createElement("div");
      additionalMessage.classList.add("message-info");
      placeModal.appendChild(additionalMessage);
    }
    additionalMessage.innerHTML = `И еще ${totalNotificationsCount - maxNotifications} уведом.`;
  }

  // Функция для проверки и удаления сообщения о дополнительных уведомлениях
  function checkForAdditionalMessage() {
    const allPushes = placeModal.querySelectorAll(`.push-modal`);
    const additionalMessage = placeModal.querySelector(".message-info");

    if (allPushes.length === 0 && additionalMessage) {
      additionalMessage.remove();
    } else if (additionalMessage) {
      additionalMessage.innerHTML = `И еще ${totalNotificationsCount - maxNotifications} уведом.`;
    }
  }

  if (objSettings && flag !== "") {
    const container2 = document.createElement("div");
    container2.classList.add("push-modal");

    const divSection = document.createElement("div");
    divSection.classList.add("section-push");

    const messageElement = document.createElement("div");
    messageElement.classList.add("message-push", "content");
    const close = document.createElement("div");
    close.classList.add("close");
    close.textContent = "X";

    divSection.appendChild(messageElement);
    container2.appendChild(divSection);
    container2.appendChild(close);
    placeModal.appendChild(container2);

    if (container2) {
      container2.classList.add(`active`);
      container2.style.display = "flex";
      messageElement.innerHTML = objSettings.status
        ? objSettings.message
        : objSettings.message;
      messageElement.style.color = objSettings.status ? "green" : "red";
      messageElement.style.fontWeight = "bold";
      container2.style.textAlign = "center";
      close.addEventListener("click", () => {
        container2.remove();
      });
    }
    flag = "";
    objSettings = [];
  }
}

async function startPushNotifications(objSettings = null, flag = "") {
  if (
    window.location.pathname === "/login" ||
    window.location.pathname === "/signup" ||
    window.location.pathname === "/" ||
    !hasLogged()
  )
    return;
  controlPush(objSettings, flag); // Вызов функции один раз сразу

  // Периодически добавляем новые уведомления
  if (flag === "") {
    setInterval(async () => {
      await generateNewNotification();
      controlPush(objSettings, flag); // Обновляем интерфейс после добавления нового уведомления
    }, 5000); // Добавляем новые уведомления каждые 5 секунд
  }
}

export { controlPush, startPushNotifications };
