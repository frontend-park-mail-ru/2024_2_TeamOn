import { ELEMENTS_CLASS, LINKS, sidebarLinks, state } from "../../consts";
import { getCurrentUser, renderLogoutButton } from "../profile/profile";
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
import { findUsername } from "../../utils/hasLogged";

function getPopularPosts() {
  return [
    {
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
function getRecentlyPosts() {
  return [
    {
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
  const containersPopularPosts = containerPopularPosts.querySelectorAll(
    `.${ELEMENTS_CLASS.POST.FEED.BLOCK}`,
  );
  containersPopularPosts.forEach((container: any, index: any) => {
    customizePost(container, popularPosts[index]);
  });

  const recentlyPosts = getPopularPosts();
  const containersRecentlyPosts = containerRecentlyPosts.querySelectorAll(
    `.${ELEMENTS_CLASS.POST.FEED.BLOCK}`,
  );
  containersRecentlyPosts.forEach((container: any, index: any) => {
    customizePost(container, recentlyPosts[index]);
  });
}
/**
 * Рендерит скелет популярных постов
 * @returns
 */
function renderPopularPosts() {
  const popularPosts = getPopularPosts();

  var posts: any = [];
  popularPosts.forEach((post: any) => {
    const container: VNode = createContainerPost(post);
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

  var posts: any = [];
  recentlyPosts.forEach((post: any) => {
    const container: VNode = createContainerPost(post);
    posts.push(container);
  });
  return posts;
}
/**
 * Кастомизирует сайдраб
 * @param sidebar
 * @returns
 */
export function customizeSidebar(sidebar: any) {
  const burger: any = document.querySelector(`.${ELEMENTS_CLASS.BURGER.BLOCK}`);
  const navMenu = document.createElement("div");
  navMenu.className = "nav-menu";

  burger.addEventListener("click", () => {
    sidebar.classList.toggle(ELEMENTS_CLASS.ACTIVE);
  });
  sidebarLinks.forEach((link: any) => {
    // const a: VNode = createElement("a")
    const a = document.createElement("a");
    a.addEventListener("click", (event) => {
      event.preventDefault(); // Предотвращаем стандартное поведение ссылки
      route(link.href);
      setActiveLink(link); // Передаем элемент ссылки в функцию
    });
    if (link.active) {
      a.className = ELEMENTS_CLASS.ACTIVE;
    }
    const i = document.createElement("i");
    i.className = link.icon;
    a.appendChild(i);
    a.appendChild(document.createTextNode(link.text));
    if (link.new) {
      const span = document.createElement("span");
      span.style.color = "red";
      span.appendChild(document.createTextNode("НОВОЕ"));
      a.appendChild(span);
    }
    navMenu.appendChild(a);
  });

  return navMenu;
}
/**
 * Кастомизирует каждый пост, который к нему пришел
 * @param container Контейнер ( популярных | недавних постов )
 * @param post Пост
 */
function customizePost(container: any, post: any = null) {
  const authorSection: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.AUTHOR.BLOCK}`,
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

  const mediaContent: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.MEDIA}`,
  );
  // mediaContent.src = "../styles/photos/home.png"
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
    const user: any | null = await getCurrentUser(window.location.pathname);
    if (!user) {
      throw new Error("Пользователь не найден");
    }
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
    const sidebar: any = container.querySelector(
      `.${ELEMENTS_CLASS.SIDEBAR.ELEMENT}`,
    );
    const searchBar: any = container.querySelector(
      `.${ELEMENTS_CLASS.SEARCH.BLOCK}`,
    );

    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        searchBar.style.position = "fixed";
        searchBar.style.top = "1.9%";
      } else {
        searchBar.style.position = "";
      }
    });
    sidebar.appendChild(customizeSidebar(sidebar));
    const userF: any = findUsername();

    if (userF) {
      sidebar.appendChild(renderLogoutButton(userF));
    } else {
      route(LINKS.HOME.HREF);
    }

    const containerPopularPosts = container.querySelector(
      ".main-container-popular",
    );
    const containerRecentlyPosts = container.querySelector(
      ".main-container-recently",
    );

    // renderPosts(containerPopularPosts, containerRecentlyPosts);
    modifirePosts(containerPopularPosts, containerRecentlyPosts);
    const side: any = container.querySelector(
      `.${ELEMENTS_CLASS.SEARCH.ELEMENT}`,
    );
    side.type = "text";
    side.placeholder = "Найти креаторов";

    sidebarLinks.forEach((link) => {
      if (window.location.pathname == link.href) {
        link.active = true;
      }
    });

    return container;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}
