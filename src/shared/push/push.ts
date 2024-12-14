import { getPushNotification } from "../../features/getNotification/getNotification";
import { getAvatar } from "../../features/getavatar/getavatar";
import {
  formatMessage2,
  modifireNotifications,
  paginateNotifications,
  renderNotifications,
} from "../../features/paginateNotification/paginateNotification";

let notifications: any = [];
let totalNotificationsCount = notifications.length; // Общее количество уведомлений

async function generateNewNotification() {
  const containerNotificationsAll: any = document.querySelector(
    ".container-all-notifications",
  );
  const containerNotificationsNotRead: any = document.querySelector(
    ".container-isnotread-notifications",
  );
  notifications = await getPushNotification();
  const k = new Set();
  if (
    notifications.length !== 0 &&
    containerNotificationsAll &&
    containerNotificationsNotRead &&
    window.location.pathname === "/notifications"
  ) {
    // const notificationElements = await renderNotifications(
    //   notifications,
    // );
    // const divNewNotifAl = containerNotificationsAll.querySelector(`.new-notif-all`);
    // const divNewNotifNotread = containerNotificationsNotRead.querySelector(`.new-notif-notread`);
    // console.log(divNewNotifAl);
    // console.log(notificationElements);
    // const first = [...notificationElements];
    // const sec = [...notificationElements];

    // divNewNotifAl.append(
    //   ...first,
    // );
    // divNewNotifNotread.append(
    //   ...sec,
    // );
    // modifireNotifications(
    //   containerNotificationsAll,
    //   containerNotificationsNotRead,
    //   notifications.reverse(),
    //   notifications.reverse(),
    // );

    const notificationElements = await renderNotifications(notifications);
    const notificationElements2 = await renderNotifications(notifications);
    const divNewNotifAl =
      containerNotificationsAll.querySelector(`.new-notif-all`);
    const divNewNotifNotread =
      containerNotificationsNotRead.querySelector(`.new-notif-notread`);

    if (divNewNotifAl && notificationElements.length > 0) {
      containerNotificationsAll.prepend(...notificationElements);
    }

    if (divNewNotifNotread && notificationElements2.length > 0) {
      containerNotificationsNotRead.prepend(...notificationElements2);
    }

    modifireNotifications(
      containerNotificationsAll,
      containerNotificationsNotRead,
      notifications.reverse(),
      notifications.reverse(),
      "push",
    );

    // await paginateNotifications(
    //   k,
    //   [],
    //   [],
    //   containerNotificationsAll,
    //   containerNotificationsNotRead,
    //   notifications,
    // );
  }
}

async function controlPush(objSettings: any = null, flag: string = "") {
  const placeModal: any = document.querySelector(`.placemodal`);
  placeModal.innerHTML = ""; // Очищаем предыдущие сообщения

  const maxNotifications = 3;
  const displayedNotifications = notifications.slice(0, maxNotifications);

  // Обновляем общее количество уведомлений
  totalNotificationsCount = notifications.length;
  if (!objSettings && flag === "") {
    for (const notification of displayedNotifications) {
      const container2 = document.createElement("div");
      container2.classList.add("push-modal");

      const divSection = document.createElement("div");
      divSection.classList.add("section-push");

      const messageElement = document.createElement("div");
      messageElement.classList.add("message-push");
      const parseMessage = formatMessage2(notification.message);
      messageElement.innerHTML = parseMessage;

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
        ); // Удаляем уведомление из массива
        checkForAdditionalMessage();
        controlPush(); // Обновляем интерфейс
      });

      // Логика для таймера и наведения
      let timeoutId = setTimeout(() => {
        container2.remove();
        notifications = notifications.filter(
          (n: any) => n.notificationID !== notification.notificationID,
        ); // Удаляем уведомление из массива
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
          ); // Удаляем уведомление из массива
          checkForAdditionalMessage();
        }, 30000);
      });
    }
  }

  // Если есть дополнительные уведомления, добавляем сообщение
  if (totalNotificationsCount > maxNotifications) {
    if (!document.querySelector(`.message-info`)) {
      const additionalMessage = document.createElement("div");
      additionalMessage.classList.add("message-info");
      additionalMessage.innerHTML = `И еще ${totalNotificationsCount - maxNotifications} уведом.`;
      placeModal.appendChild(additionalMessage);
    } else {
      const additionalMessage: any = document.querySelector(".message-info");
      additionalMessage.innerHTML = `И еще ${totalNotificationsCount - maxNotifications} уведом.`;
    }
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

    // Проверяем, есть ли еще уведомления в массиве
    if (notifications.length > maxNotifications) {
      controlPush(); // Обновляем интерфейс
    }
  }

  if (objSettings && flag !== "") {
    const additionalMessage = document.createElement("div");
    const container2 = document.createElement("div");
    container2.classList.add("push-modal");

    const divSection = document.createElement("div");
    divSection.classList.add("section-push");

    const messageElement = document.createElement("div");
    messageElement.classList.add("message-push");

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
      if (objSettings.status) {
        messageElement.innerHTML = objSettings.message;
        messageElement.style.color = "green";
      } else {
        messageElement.innerHTML = objSettings.message;
        messageElement.style.color = "red";
      }
      close.addEventListener("click", () => {
        container2.remove();
      });
    }
    flag = "";
    objSettings = [];
  }
}

async function startPushNotifications(objSettings = null, flag = "") {
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
