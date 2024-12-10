import { paginate } from "../paginateFeed/paginateFeed";

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
export function showZeroNotif(container: any) {
  const zero: any = document.querySelector(`.zero-notif`);
  if (
    zero &&
    !container.querySelector("div") &&
    window.location.pathname === "/notifications"
  ) {
    zero.style.display = "flex";
  }
}
function updateCtn(first: any, second: any, idx: any) {
  switch (idx) {
    case 0:
      showZeroNotif(first);
      first.style.display = "flex";
      second.style.display = "none";
      break;
    case 1:
      showZeroNotif(second);
      first.style.display = "none";
      second.style.display = "flex";
      break;
  }
}
export {
  controlActiveLink,
  controlFeed,
  controlModeration,
  controlNotification,
};
