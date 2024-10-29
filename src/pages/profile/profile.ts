import { ELEMENTS_CLASS, LINKS, LOCATIONS } from "../../consts";
import { fetchAjax } from "../../utils/fetchAjax";
import { removeItemLocalStorage } from "../../utils/storages";
import { route } from "../../utils/routing";
import { renderSidebar } from "../feed/feedView";
import {
  renderButtonCreatePost,
  renderCreatePost,
  renderTip,
  renderUserInfo,
  renderUserPosts,
  renderUserStats,
  renderVibe,
} from "./profileView";
import { VNode } from "../../lib/vdom/src/source";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { pageContainer } from "../../index";
import { findUsername } from "../../utils/hasLogged";
import { modifierSidebar } from "../feed/feed";

function getUserPosts() {
  return [
    {
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
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
 * Получение текущего профиля через объект типа промис
 * @returns Информация о пользователе
 */
export function getCurrentUser(link: string) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      link === LINKS.PROFILE.HREF
        ? LOCATIONS.PROFILE.METHOD
        : LOCATIONS.OTHER_PAGE.METHOD,
      link === LINKS.PROFILE.HREF
        ? LOCATIONS.PROFILE.HREF
        : LOCATIONS.OTHER_PAGE.HREF,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 401) {
          route(LINKS.LOGIN.HREF);
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}

/**
 * Функция рендерит кнопку выхода из системы.
 * @param {*} Item Ключ, по которому необходимо стереть локальные и сессионные данные
 * @returns
 */
export function renderLogoutButton() {
  const logout: VNode = createElement(
    "div",
    { class: ELEMENTS_CLASS.LOGOUT.BLOCK },
    [
      createElement("div", { class: ELEMENTS_CLASS.LOGOUT.COMBINE }, [
        createText("Выйти"),
      ]),
    ],
  );
  return logout;
}

function renderPosts() {
  const userPosts = getUserPosts();

  var posts: any = [];
  userPosts.forEach((post: any) => {
    const container: VNode = renderUserPosts(post);
    posts.push(container);
  });
  return posts;
}
function modifirePosts(containerPosts: any) {
  const posts: any = getUserPosts();
  containerPosts = containerPosts.querySelectorAll(".post");
  containerPosts.forEach((container: any, index: any) => {
    customizePost(container, posts[index]);
  });
}

function customizePost(container: any, post: any) {
  const title = container.querySelector(".title");
  title.innerHTML = post.title;
  const content = container.querySelector(".content");
  content.innerHTML = post.content;
  const date = container.querySelector(".date");
  date.innerHTML = post.date;
}
/**
 * Асинхронная функция рендеринга профиля пользователя.
 * @returns созданный элемент профиля пользователя или 0,
 * если пользователь не найден
 */
export async function renderProfile() {
  try {
    const user: any = await getCurrentUser(window.location.pathname);

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const doc: any = document.body;
    doc.style.height = "100%";

    const vdom: VNode = createElement("div", { class: "main-content" }, [
      createElement("div", { class: ELEMENTS_CLASS.PROFILE.FORM }, [
        createElement("div", { class: ELEMENTS_CLASS.PROFILE.HEADER }, [
          renderVibe(user),
        ]),
        createElement("div", { class: ELEMENTS_CLASS.PROFILE.BLOCK }, [
          renderUserInfo(user, null),
          createElement("div", { class: ELEMENTS_CLASS.PROFILE.RIGHT }, [
            renderUserStats(user, user),
            renderButtonCreatePost(),
            ...renderPosts(),
          ]),
        ]),
      ]),
      renderSidebar(),
      renderCreatePost(),
      renderTip(),
    ]);

    const container = update(pageContainer, vdom);

    const mainContent = container.querySelector(".main-content");
    modifierSidebar(mainContent);

    const containerPosts: any = container.querySelector(
      `.${ELEMENTS_CLASS.PROFILE.FORM}`,
    );
    const buttonCancel: any = container.querySelector(
      `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
    );

    if (window.location.pathname === "/feed/profile") {
      const containerCreatePost = container.querySelector(".modal__createpost");
      const buttonCreatePost: any = container.querySelector(".create-posts");

      buttonCreatePost?.addEventListener("click", () => {
        containerCreatePost.style.display = "block";
        containerPosts.classList.add("blur");
      });
      buttonCancel?.addEventListener("click", () => {
        containerCreatePost.style.display = "none";
        containerPosts.classList.remove("blur");
      });
    }
    if (window.location.pathname !== "/feed/profile") {
      const containerTip = container.querySelector(".modal__tip");
      const buttonTip = container.querySelector(
        `.${ELEMENTS_CLASS.DONATE.BLOCK}`,
      );

      buttonTip?.addEventListener("click", () => {
        containerTip.style.display = "block";
        containerPosts.classList.add("blur");
      });
      buttonCancel?.addEventListener("click", () => {
        containerTip.style.display = "none";
        containerPosts.classList.remove("blur");
      });
    }

    modifirePosts(containerPosts);

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
