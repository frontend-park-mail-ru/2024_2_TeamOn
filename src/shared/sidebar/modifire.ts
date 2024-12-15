import { getAvatar } from "../../features/getavatar/getavatar";
import {
  urlIconHome,
  urlIconModeration,
  urlIconNotification,
  urlIconProfile,
  urlIconSettings,
} from "../../app";
import { controlBecomeCreator } from "../../pages/profile";
import { ELEMENTS_CLASS, sidebarLinks } from "../consts/consts";
import { setStatic } from "../getStatic/getStatic";
import { route } from "../routing/routing";
import { setActiveLink } from "../setActiveLink/setActiveLink";
import { hasLogged } from "../utils/hasLogged";
/**
 * Кастомизирует сайдбар
 * @param sidebar
 * @returns
 */
async function modifierSidebar(mainContainer?: any) {
  if (!mainContainer) {
    return;
  }
  const avatar: any = await getAvatar("/profile");
  const divAvatar: any = mainContainer.querySelector(`.avatar-profile-sidebar`);
  if (divAvatar) {
    divAvatar.src = avatar;
  }
  const sidebar = mainContainer.querySelector(".sidebar");
  const burger: any = mainContainer.querySelector(`.burger2`);
  if (burger) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      sidebar.classList.toggle(ELEMENTS_CLASS.ACTIVE);
    });
  }
  const iconHome: any = sidebar.querySelector(`.icon-home`);
  setStatic(iconHome, urlIconHome);

  if (hasLogged()) {
    const iconSettings: any = sidebar.querySelector(`.icon-settings`);
    setStatic(iconSettings, urlIconSettings);

    const iconModeration: any = sidebar.querySelector(`.icon-moderation`);
    setStatic(iconModeration, urlIconModeration);

    const iconNotification: any = sidebar.querySelector(`.icon-notification`);
    setStatic(iconNotification, urlIconNotification);

    const iconProfile: any = sidebar.querySelector(`.icon-profile`);
    setStatic(iconProfile, urlIconProfile);
  }

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
      const i = sidebarReferenses[index].querySelector("i");
      i.classList.add("active");
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
