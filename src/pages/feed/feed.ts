import { ELEMENTS_CLASS, LINKS, sidebarLinks, state } from "../../consts";
import { getCurrentUser } from "../profile/profile";
import {
  renderSearchbar,
  renderSidebar,
  createContainerPost,
  setActiveLink,
} from "../feed/feedView";
import { VNode } from "../../lib/vdom/src/source";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { pageContainer } from "../../index";
import { route } from "../../utils/routing";
import { removeItemLocalStorage } from "../../utils/storages";

function getPopularPosts() {
  return [
    {
      id: 1,
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Alolo",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
      id: 2,
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Anatolich",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
      id: 3,
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Anatolich",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
      id: 4,
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Anatolich",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
  ];
}
function getmedia() {
  return [
    {
      postId: 1,
      mediaContent: [
        {
          file: "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
        },
        {
          file: "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
        },
        {
          file: "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
        },
      ],
    },
  ];
}
function getRecentlyPosts() {
  return [
    {
      id: 1,
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Anatolich",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
      id: 2,
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Anatolich",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
  ];
}
/**
 * Берет каждый пост и наполняет его
 * @param containerPopularPosts Контейнер популярных постов
 * @param containerRecentlyPosts Контейнер недавних постов
 */
function modifirePosts(
  containerPopularPosts: any,
  containerRecentlyPosts: any,
) {
  const popularPosts = getPopularPosts();
  const mediacontent = getmedia();

  const containersPopularPosts = containerPopularPosts.querySelectorAll(
    `.${ELEMENTS_CLASS.POST.FEED.BLOCK}`,
  );
  containersPopularPosts.forEach((container: any, index: any) => {
    customizePost(container, popularPosts[index], mediacontent);
  });

  const recentlyPosts = getPopularPosts();
  const containersRecentlyPosts = containerRecentlyPosts.querySelectorAll(
    `.${ELEMENTS_CLASS.POST.FEED.BLOCK}`,
  );
  containersRecentlyPosts.forEach((container: any, index: any) => {
    customizePost(container, recentlyPosts[index], mediacontent);
  });
}
/**
 * Рендерит скелет популярных постов
 * @returns
 */
function renderPopularPosts() {
  const popularPosts = getPopularPosts();
  const media = getmedia();

  var posts: any = [];
  popularPosts.forEach((post: any) => {
    const mediaContent =
      media.find((m) => m.postId === post.postId)?.mediaContent || [];

    const container: VNode = createContainerPost(post, mediaContent);
    posts.push(container);
  });
  return posts;
}
/**
 * Рендерит скелет популярных постов
 * @returns
 */
function renderRecentlyPosts() {
  const recentlyPosts = getRecentlyPosts();
  const media = getmedia();
  var arrayMedia: any = [];

  var posts: any = [];
  recentlyPosts.forEach((post: any) => {
    media.forEach((oneMedia: any) => {
      if (oneMedia.postId == post.id) {
        arrayMedia.push(oneMedia);
      }
    });
    console.log(arrayMedia);
    const container: VNode = createContainerPost(post, arrayMedia);
    posts.push(container);
  });
  return posts;
}
/**
 * Кастомизирует сайдраб
 * @param sidebar
 * @returns
 */
export function modifierSidebar(mainContainer: any) {
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
    span.style.color = "red";

    window.addEventListener("popstate", () => {
      sidebarLinks.forEach((link: any, index: any) => {
        if (window.location.pathname === link.href) {
          setActiveLink(link);
        } else {
          sidebarReferenses[index].classList.remove(ELEMENTS_CLASS.ACTIVE);
        }
      });
    });
  });
}
/**
 * Кастомизирует каждый пост, который к нему пришел
 * @param container Контейнер ( популярных | недавних постов )
 * @param post Пост
 */
function customizePost(container: any, post: any = null, mediaContents: any[]) {
  const authorSection: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.AUTHOR.NAME}`,
  );

  const avatar: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.AUTHOR.AVATAR}`,
  );
  if (avatar) {
    avatar.alt = "Аватар автора";
    avatar.height = 50;
    avatar.src = post.avatarSrc;
    avatar.width = 50;
  }
  const authorName: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.AUTHOR.NAME}`,
  );
  authorName.textContent = post.authorName;
  const author_id = 12; // БЕКЕНД ЗАГЛУШКА
  authorSection.addEventListener("click", () => {
    route(`/profile/${author_id}`);
  });

  const title: any = container.querySelector(`.${ELEMENTS_CLASS.POST.TITLE}`);
  title.textContent = post.title;

  const content: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.CONTENT}`,
  );
  content.textContent = post.content;

  const mediaConten: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.MEDIA}`,
  );
  // mediaConten.src = mediaContents[1].mediaContent[1].file;
  // mediaContent.alt = "Описание"

  const date: any = container.querySelector(`.${ELEMENTS_CLASS.POST.DATE}`);
  date.textContent = post.date;

  const amountLike: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.LIKES.AMOUNT}`,
  );
  amountLike.innerHTML = `${post.likes}`;

  const amountComment: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.COMMENTS.AMOUNT}`,
  );
  amountComment.innerHTML = `${post.likes}`;
}
export async function renderFeed() {
  try {
    sidebarLinks.forEach((link) => {
      if (window.location.pathname == link.href) {
        link.active = true;
      } else {
        link.active = false;
      }
    });
    const user: any | null = await getCurrentUser(window.location.pathname);
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    user.role === "Reader"
      ? (state.currentUser.reader = user)
      : (state.currentUser.author = user);

    const doc: any = document.body;
    doc.style.height = "100%";
    const vdom: VNode = createElement("div", { class: "main-content" }, [
      renderSearchbar(),
      renderSidebar(),
      createElement("div", { class: "right-content" }, [
        createElement("div", { class: "section-title" }, [
          createText("Популярное"),
        ]),
        createElement("div", { class: "main-container-popular" }, [
          ...renderPopularPosts(),
        ]),
        createElement("div", { class: "section-title" }, [
          createText("Недавние"),
        ]),
        createElement("div", { class: "main-container-recently" }, [
          ...renderRecentlyPosts(),
        ]),
      ]),
    ]);

    const container = update(pageContainer, vdom);
    state.currentUser = user;

    const searchBar: any = container.querySelector(
      `.${ELEMENTS_CLASS.SEARCH.BLOCK}`,
    );

    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        searchBar.style.position = "fixed";
      } else {
        searchBar.style.position = "";
      }
    });
    const mainContent = container.querySelector(".main-content");
    modifierSidebar(mainContent);

    const containerPopularPosts = container.querySelector(
      ".main-container-popular",
    );
    const containerRecentlyPosts = container.querySelector(
      ".main-container-recently",
    );

    modifirePosts(containerPopularPosts, containerRecentlyPosts);

    const side: any = container.querySelector(
      `.${ELEMENTS_CLASS.SEARCH.ELEMENT}`,
    );
    side.type = "text";
    side.placeholder = "Найти креаторов";

    const logoutbutton = container.querySelector(
      `.${ELEMENTS_CLASS.LOGOUT.BLOCK}`,
    );

    logoutbutton.addEventListener("click", (event: any) => {
      event.preventDefault();
      removeItemLocalStorage(user.username);
      route(LINKS.HOME.HREF);
    });
    return container;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}
