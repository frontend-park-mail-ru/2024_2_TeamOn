import { state, ELEMENTS_CLASS, LINKS, REGEXP } from "../shared/consts/consts";
import { renderSignup } from "../pages/signup";
import { renderProfile } from "../pages/profile";
import { renderHome } from "../pages/home";
import { startA } from "./providers/menu";
import "./styles/style.css";
import { controlEventIFrame, renderFeed } from "../pages/feed";
import { route } from "../shared/routing/routing";
import { renderNotifications } from "../pages/notifications";
import { renderSettings } from "../pages/settings";
import { VirtualDOM } from "../../lib/vdom/src/source";
import { render, renderTo } from "../../lib/vdom/lib";
import { renderLogin } from "../pages/login";
import { modifierSidebar } from "../shared/sidebar/modifire";
import { renderCreatePost } from "../pages/addPost";
import { renderUpdatePost } from "../entities/userPost";
import { hasLogged } from "../shared/utils/hasLogged";
import { renderModeration } from "../pages/moderation";
import { getUrlStatic } from "../shared/getStatic/getStatic";
import { startPushNotifications } from "../shared/push/push";
import { Sidebar } from "../shared/sidebar/sidebar";

/**
 * Объект, содержащий конфигурацию меню приложения.
 */

interface SyncLinkConfig {
  href: string;
  text: string;
  render: () => Element | undefined;
}

interface AsyncLinkConfig {
  href: string;
  text: string;
  render: () => Promise<HTMLElement> | undefined;
}

interface MenuConfig {
  home: AsyncLinkConfig;
  login: AsyncLinkConfig;
  signup: AsyncLinkConfig;
  profile: AsyncLinkConfig;
  settings: AsyncLinkConfig;
  feed: AsyncLinkConfig;
  createPost: AsyncLinkConfig;
  updatePost: AsyncLinkConfig;
  notifications: AsyncLinkConfig;
  moderation: AsyncLinkConfig;
}

interface Config {
  menu: MenuConfig;
}

const config: Config = {
  menu: {
    home: {
      href: LINKS.HOME.HREF,
      text: LINKS.HOME.TEXT,
      render: renderHome,
    },
    login: {
      href: LINKS.LOGIN.HREF,
      text: LINKS.LOGIN.TEXT,
      render: renderLogin,
    },
    signup: {
      href: LINKS.SIGNUP.HREF,
      text: LINKS.SIGNUP.TEXT,
      render: renderSignup,
    },
    profile: {
      href: LINKS.PROFILE.HREF,
      text: LINKS.PROFILE.TEXT,
      render: renderProfile,
    },
    settings: {
      href: LINKS.ERROR.HREF,
      text: LINKS.ERROR.TEXT,
      render: renderSettings,
    },
    feed: {
      href: LINKS.FEED.HREF,
      text: LINKS.FEED.TEXT,
      render: renderFeed,
    },
    createPost: {
      href: LINKS.CREATE_POST.HREF,
      text: LINKS.CREATE_POST.TEXT,
      render: renderCreatePost,
    },
    updatePost: {
      href: LINKS.UPDATE_POST.HREF,
      text: LINKS.UPDATE_POST.TEXT,
      render: renderUpdatePost,
    },
    notifications: {
      href: LINKS.NOTIFICATIONS.HREF,
      text: LINKS.NOTIFICATIONS.TEXT,
      render: renderNotifications,
    },
    moderation: {
      href: LINKS.MODERATION.HREF,
      text: LINKS.MODERATION.TEXT,
      render: renderModeration,
    },
  },
};

interface State {
  activePageLink: HTMLElement | null;
}

const state2: State = {
  activePageLink: null,
};

export function setupScrollPositionHandlers() {
  document.addEventListener("DOMContentLoaded", () => {
    const saveScrollPosition = () => {
      const scrollPosition: any = window.scrollY;
      sessionStorage.setItem("scrollPosition", scrollPosition);
    };

    // Сохраняем позицию прокрутки при прокрутке
    window.addEventListener("scroll", saveScrollPosition);

    // Восстанавливаем позицию прокрутки при загрузке страницы
    window.addEventListener("load", () => {
      const savedScrollPosition = sessionStorage.getItem("scrollPosition");
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }
    });

    // Сохраняем позицию прокрутки перед выгрузкой страницы
    window.addEventListener("beforeunload", saveScrollPosition);
    // Обработка события popstate для навигации
    window.addEventListener("popstate", () => {
      const savedScrollPosition = sessionStorage.getItem("scrollPosition");
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }
    });
  });
  return true;
}

// Вызов функции для установки обработчиков
const flag: any = setupScrollPositionHandlers();

/**
 * Перенаправляет на другую страницу приложения.
 * @param {*} targetLinkMenu Ссылка на страницу, на которую нужно перенаправить
 * @param {*} statusErr Статус ошибки (необязательный)
 */
export function goToPage(targetLinkMenu: any, statusErr = null) {
  pageContainer.innerHTML = "";
  state2.activePageLink?.classList.remove(ELEMENTS_CLASS.ACTIVE);
  targetLinkMenu.classList.add(ELEMENTS_CLASS.ACTIVE);

  const sectionKey = targetLinkMenu.dataset.section as keyof MenuConfig;
  const routeConfig = config.menu[sectionKey];

  const renderPromise = Promise.resolve(routeConfig.render());
  renderPromise.catch((error) => {
    console.error("ERROR:", error);
  });
}

export const Virtual: any = new VirtualDOM();
export const pageContainer = document.createElement("main");
const placemodal = document.createElement("div");
placemodal.classList.add("placemodal");
const pushmodal = document.createElement("div");
const message = document.createElement("div");
message.classList.add("message-push");
const close = document.createElement("div");
close.classList.add("close");
close.textContent = "X";

const avatar = document.createElement("img");
avatar.classList.add("avatar-push");
pushmodal.className = "push-modal";
pushmodal.style.display = "none";
pushmodal.append(avatar, message, close);
placemodal.appendChild(pushmodal);

if (hasLogged()) {
  controlEventIFrame();
} else {
  localStorage.clear();
  sessionStorage.clear();
}
export const urlCloseModal: any = await getUrlStatic("/close.png");
export const urlLeftArrowModal: any = await getUrlStatic("/left-arrow.png");
export const urlRightArrowModal: any = await getUrlStatic("/right-arrow.png");
export const urlPushbackIcon: any = await getUrlStatic("/pushback.png");
export const urlAddCustomSubs: any = await getUrlStatic("/addsubs.png");
export const urlIconEditBackground: any = await getUrlStatic("/icon_edit.png");
export const urlIconHome: any = await getUrlStatic("/icon_home.png");
export const urlIconNotification: any = await getUrlStatic(
  "/icon_notification.png",
);
export const iconNotificationRead: any = await getUrlStatic("/readNotif.png");
export const iconNotificationClear: any = await getUrlStatic(
  "/notificationClear.png",
);
export const urlIconSettings: any = await getUrlStatic("/icon_settings.png");
export const urlIconProfile: any = await getUrlStatic("/icon_profile.png");
export const urlIconModeration: any = await getUrlStatic("/police.png");
export const urlIconLike: any = await getUrlStatic("/icon_like.png");
export const urlIconComment: any = await getUrlStatic("/icon_comment.png");
export const urlIconAttache: any = await getUrlStatic("/paperclip.png");
export const urlRemoveButtonFile: any = await getUrlStatic("/closefile.png");
export const urlHomeContainer: any = await getUrlStatic("/fon.png");
export const urlHomeContainerSec: any = await getUrlStatic("/human.jpg");
export const urlLogin: any = await getUrlStatic("/login.png");
export const urlSignup: any = await getUrlStatic("/signup.png");
export const urlEyeSeePassword: any = await getUrlStatic("/eye_see.png");
export const urlEyeNoSeePassword: any = await getUrlStatic("/eye_nsee.png");
export const urlVideoDownload: any = await getUrlStatic("/forward.png");
export const urlSendComment: any = await getUrlStatic("/sendblue.png");
export const urlVideoVolume: any = await getUrlStatic("/volume.png");
export const urlVideoVolumeMute: any = await getUrlStatic("/volumeStop.png");
export const urlFullHD: any = await getUrlStatic("/shar.png");
export const urlVideoPlay: any = await getUrlStatic("/playArrow.png");
export const urlVideoStop: any = await getUrlStatic("/stopArrow.png");
export const urlEditComment: any = await getUrlStatic("/penEdit.png");
export const urlDeleteComment: any = await getUrlStatic("/deleteComm.png");
export const urlSad: any = await getUrlStatic("/sad.png");
export const iconStatusBlock: any = await getUrlStatic("/blocked.png");
export const iconStatusPublished: any = await getUrlStatic("/published.png");

const favicon: any = await getUrlStatic("/fav.png");

const link = document.createElement("link");
link.rel = "icon";
link.href = favicon;
document.head.appendChild(link);
// const sidebar = await Sidebar();
// const divSidebar = renderTo(sidebar);
if (flag) {
  let root: HTMLElement | null = startA(config.menu, state);
  render(Virtual);
  root?.appendChild(placemodal);
  // root?.appendChild(divSidebar);
  root?.appendChild(pageContainer);
  route(LINKS.HOME.HREF, window.location.pathname);
  startPushNotifications();
  modifierSidebar(document.querySelector("#main"));
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js", { scope: "/" })
    .then((reg) => {
      console.log("sw registered", reg);
    })
    .catch((e) => {
      console.error(e);
    });
}
