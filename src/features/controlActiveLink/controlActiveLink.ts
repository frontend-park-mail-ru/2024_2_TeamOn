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
function controlActiveLink(tab: any, callback: any) {
  callback(tab);
}

function updateCtn(first: any, second: any, idx: any) {
  switch (idx) {
    case 0:
      first.style.display = "block";
      second.style.display = "none";
      break;
    case 1:
      first.style.display = "none";
      second.style.display = "block";
      break;
  }
}
export { controlActiveLink, controlFeed, controlModeration };
