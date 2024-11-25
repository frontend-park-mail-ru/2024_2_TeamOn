import { controlBecomeCreator } from "../../pages/profile";
import { ELEMENTS_CLASS, sidebarLinks } from "../consts/consts";
import { route } from "../routing/routing";
import { setActiveLink } from "../setActiveLink/setActiveLink";
/**
 * Кастомизирует сайдбар
 * @param sidebar
 * @returns
 */
function modifierSidebar(mainContainer?: any) {
  if (!mainContainer) {
    return;
  }

  const burger: any = mainContainer.querySelector(
    `.${ELEMENTS_CLASS.BURGER.BLOCK}`,
  );

  const sidebar = mainContainer.querySelector(".sidebar");
  burger.addEventListener("click", () => {
    sidebar.classList.toggle(ELEMENTS_CLASS.ACTIVE);
  });
  const sidebarReferenses = sidebar.querySelectorAll(".referens");
  sidebarLinks.forEach((link: any, index: any) => {
    sidebarReferenses[index]?.addEventListener("click", (event: any) => {
      event.preventDefault();
      setActiveLink(link);
      route(link.href);
    });
    if (window.location.pathname === link.href) {
      setActiveLink(link);
    }
    if (link.active) {
      sidebarReferenses[index].className = ELEMENTS_CLASS.ACTIVE;
    }
    const span: any = mainContainer.querySelector(".new");
    if (span) {
      span.style.color = "red";
    }

    window.addEventListener("popstate", () => {
      sidebarLinks.forEach((link: any, index: any) => {
        if (window.location.pathname === link.href) {
          setActiveLink(link);
        } else {
          if (sidebarReferenses[index]) {
            sidebarReferenses[index].classList.remove(ELEMENTS_CLASS.ACTIVE);
          }
        }
      });
    });
  });
  
  const containerBecomeCreator = sidebar.querySelector(`.become-a-creator`);
  controlBecomeCreator(containerBecomeCreator);
}

export { modifierSidebar };
