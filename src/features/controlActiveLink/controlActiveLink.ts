import { getNotification } from "../getNotification/getNotification";
import { paginate } from "../paginateFeed/paginateFeed";
import {
  modifireNotifications,
  paginateNotifications,
} from "../paginateNotification/paginateNotification";

function controlFeed(tab: any) {
  const containerPopularPosts: any = document.querySelector(
    `.main-container-popular`,
  );
  const containerRecentlyPosts: any = document.querySelector(
    `.main-container-recently`,
  );

  tab.querySelectorAll("a").forEach((link: any, index: number) => {
    const initial: any =
      sessionStorage.getItem("feed") == null
        ? 0
        : sessionStorage.getItem("feed");
    link.className = index.toString() === initial.toString() ? "active" : "";
    link.addEventListener("click", async (event: any) => {
      event.preventDefault();
      tab.querySelectorAll("a").forEach((linkreset: any, index: number) => {
        linkreset.classList.remove("active");
      });
      link.classList.add("active");
      sessionStorage.setItem("feed", index.toString());
      updateCtn(containerPopularPosts, containerRecentlyPosts, index);
    });
  });
}
function controlModeration(tab: any) {
  const containerPublishPosts: any = document.querySelector(
    `.main-container-publish`,
  );
  const containerReportedPosts: any = document.querySelector(
    `.main-container-reported`,
  );

  tab.querySelectorAll("a").forEach((link: any, index: number) => {
    const initial: any =
      sessionStorage.getItem("moderation") == null
        ? 0
        : sessionStorage.getItem("moderation");
    link.className = index.toString() === initial.toString() ? "active" : "";
    link.addEventListener("click", async (event: any) => {
      event.preventDefault();
      tab.querySelectorAll("a").forEach((linkreset: any, index: number) => {
        linkreset.classList.remove("active");
      });
      link.classList.add("active");
      sessionStorage.setItem("moderation", index.toString());
      updateCtn(containerPublishPosts, containerReportedPosts, index);
    });
  });
}

function controlNotification(tab: any) {
  const containerPublishPosts: any = document.querySelector(
    `.container-all-notifications`,
  );
  const containerReportedPosts: any = document.querySelector(
    `.container-isnotread-notifications`,
  );

  tab.querySelectorAll("a").forEach((link: any, index: number) => {
    const initial: any =
      sessionStorage.getItem("notification") == null
        ? "0"
        : sessionStorage.getItem("notification");
    link.className = index.toString() === initial.toString() ? "active" : "";
    link.addEventListener("click", async (event: any) => {
      event.preventDefault();
      tab.querySelectorAll("a").forEach((linkreset: any, index: number) => {
        linkreset.classList.remove("active");
      });
      link.classList.add("active");
      sessionStorage.setItem("notification", index.toString());
      updateCtn(containerPublishPosts, containerReportedPosts, index);
    });
  });
}

function controlActiveLink(tab: any, callback: any) {
  callback(tab);
}
const keyAvatar = new Set();

export async function showZeroNotif(container: any, idx: number) {
  const zero: any = document.querySelector(`.zero-notif`);

  // Проверяем, нужно ли показывать сообщение о нулевых уведомлениях
  if (
    zero &&
    !container.querySelector("div") &&
    window.location.pathname === "/notifications"
  ) {
    zero.style.display = "flex";
  } else {
    zero.style.display = "none";
  }

  const containerNotificationsAll: any = document.querySelector(
    ".container-all-notifications",
  );
  const containerNotificationsNotRead: any = document.querySelector(
    ".container-isnotread-notifications",
  );

  // Управляем отображением контейнеров в зависимости от idx
  let IsNotnotifications: any = await getNotification(0, "notread", 300);
  let notifications: any = await getNotification(0, "", 300);
  if (idx === 0) {
    modifireNotifications(
      containerNotificationsAll,
      containerNotificationsNotRead,
      notifications,
      [],
    );
    containerNotificationsAll.style.display = "flex";
    containerNotificationsNotRead.style.display = "none";
  } else {
    modifireNotifications(
      containerNotificationsAll,
      containerNotificationsNotRead,
      [],
      IsNotnotifications,
    );
    containerNotificationsNotRead.style.display = "flex";
    containerNotificationsAll.style.display = "none";
  }

  // const k = new Set();
  // await paginateNotifications(
  //   k,
  //   [],
  //   [],
  //   containerNotificationsAll,
  //   containerNotificationsNotRead,
  // );
}
async function updateCtn(first: any, second: any, idx: any) {
  switch (idx) {
    case 0:
      first.style.display = "flex";
      second.style.display = "none";
      await showZeroNotif(first, idx);
      break;
    case 1:
      first.style.display = "none";
      second.style.display = "flex";
      await showZeroNotif(second, idx);
      break;
  }
}
export {
  controlActiveLink,
  controlFeed,
  controlModeration,
  controlNotification,
};
