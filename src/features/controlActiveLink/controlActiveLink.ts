import { VNode } from "../../../lib/vdom/src/source";
import { renderTo } from "../../../lib/vdom/lib";
import {
  containerPopularposts,
  containerRecentlyposts,
} from "../../widgest/feed";

function controlActiveLink(tab: any, content: any) {
  const containerPopularPosts: any = document.querySelector(
    `.main-container-recently`,
  );
  const containerRecentlyPosts: any = document.querySelector(
    `.main-container-popular`,
  );

  tab.querySelectorAll("a").forEach((link: any, index: number) => {
    const initial: any =
      sessionStorage.getItem("feed") == null
        ? 0
        : sessionStorage.getItem("feed");
    link.className = index.toString() === initial.toString() ? "active" : "";

    link.addEventListener("click", (event: any) => {
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

function updateCtn(ctnpopular: any, ctnrecently: any, idx: any) {
  switch (idx) {
    case 1:
      ctnpopular.style.display = "block";
      ctnrecently.style.display = "none";
      break;
    case 0:
      ctnpopular.style.display = "none";
      ctnrecently.style.display = "block";
      break;
  }
}
export { controlActiveLink };
