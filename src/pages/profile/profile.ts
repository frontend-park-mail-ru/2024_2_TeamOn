import { ELEMENTS_CLASS, LINKS, LOCATIONS, QUERY } from "../../consts";
import { fetchAjax } from "../../utils/fetchAjax";
import { removeItemLocalStorage } from "../../utils/storages";
import { route } from "../../utils/routing";
import { renderSidebar } from "../feed/feedView";
import {
  renderButtonCreatePost,
  renderCreatePost,
  renderDeletePost,
  renderEditPost,
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
var offset = 0;

function getUserPosts(link: string) {
  return new Promise((resolve, reject) => {
    offset += QUERY.LIMIT;
    const jsonString = `[
  {
    "postId": "1",
    "title": "Это тоже заголовок",
    "content": "Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?",
    "likes": 10,
    "isLiked": false,
    "createdAt": "30.10.2024"
  },
    {
    "postId": "2",
    "title": "Ого и это заголовок, но последний",
    "content": "Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?",
    "likes": 11,
    "isLiked": false,
    "createdAt": "30.10.2024"
  },
    {
    "postId": "3",
    "title": "Ну тоже заголовок ладно, теперь точно последний",
    "content": "Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?",
    "likes": 500,
    "isLiked": false,
    "createdAt": "30.10.2024"
  },
    {
    "postId": "4",
    "title": "Вот-вот и уже все, последний точно",
    "content": "Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?Когда бек будет готов?",
    "likes": 90,
    "isLiked": false,
    "createdAt": "30.10.2024"
  }
]`;

    try {
      const post = JSON.parse(jsonString); // Конвертация JSON в объект
      resolve(post); // Возвращаем объект
    } catch (error) {
      reject(error);
    }
    // fetchAjax(
    // link == LINKS.
    //   LOCATIONS.POSTS.AUTHOR_POST.METHOD,
    //   LOCATIONS.POSTS.AUTHOR_POST.HREF +
    //     `${authorId/me}?limit=${QUERY.LIMIT}&offset=${offset}`,
    //   null,
    //   (response) => {
    //     if (response.ok) {
    //       response.json().then((data) => {
    //         resolve(data);
    //       });
    //     } else if (response.status === 404) {
    //       reject("Пост не найден");
    //     } else {
    //       reject(new Error("Внутреняя ошибка сервера"));
    //     }
    //   },
    // );
  });
}
/**
 * Получение текущей страницы профиля через объект типа промис
 * @returns Информация о пользователе
 */
export function getPageAuthor(link: string) {
  const authorId = 12;
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      "/api/profile",
      // LOCATIONS.AUTHOR.GET_PAGE.METHOD,
      // link === LINKS.PROFILE.HREF
      //   ? "/api/author/me/media"
      //   : `/api/author/${authorId}/media`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 401) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}

function getPageMedia(link: string) {
  const authorId = 12;
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.AUTHOR.GET_PAGE_MEDIA.METHOD,
      link === LINKS.PROFILE.HREF
        ? "/api/author/me/media"
        : `/api/author/${authorId}/media`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 401) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}
/**
 * Получение данных о пользователе через объект типа промис
 * @returns Информация о пользователе
 */
export function getCurrentUser(link: string) {
  const authorId = 12;
  return new Promise((resolve, reject) => {
    fetchAjax(
      link === LINKS.PROFILE.HREF
        ? LOCATIONS.AUTHOR.GET_PAGE.METHOD
        : LOCATIONS.AUTHOR.GET_PAGE.METHOD,
      link === LINKS.PROFILE.HREF
        ? LOCATIONS.AUTHOR.GET_PAGE.HREF
        : LOCATIONS.AUTHOR.GET_PAGE.HREF,
      // LOCATIONS.ACCOUNT.GET_ACCOUNT.METHOD,
      // LOCATIONS.ACCOUNT.GET_ACCOUNT.HREF,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 401) {
          route(LINKS.ERROR.HREF);
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

function renderPosts(authorPosts: any[]) {
  var posts: any = [];
  authorPosts.forEach((post: any) => {
    const container: VNode = renderUserPosts(post);
    posts.push(container);
  });
  return posts;
}
function modifirePosts(containers: any, posts: any[]) {
  const menu = containers.querySelectorAll(`.menu-icon`);
  const dropdownMenu = containers.querySelectorAll(`.dropdown-menu`);
  document.body.addEventListener("click", () => {
    dropdownMenu.forEach((dropdown: any, dropdownIndex: number) => {
      dropdown.classList.remove(ELEMENTS_CLASS.ACTIVE);
    });
  });
  menu.forEach((menuElement: any, index: number) => {
    menuElement.addEventListener("click", (event: any) => {
      event.stopPropagation();
      dropdownMenu.forEach((dropdown: any, dropdownIndex: number) => {
        if (dropdownIndex !== index) {
          dropdown.classList.remove(ELEMENTS_CLASS.ACTIVE);
        }
      });

      dropdownMenu[index].classList.toggle(ELEMENTS_CLASS.ACTIVE);
      const buttonCancel: any = document.querySelectorAll(
        `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
      );
      const buttonDeleteConfirm: any = document.querySelector(
        `.${ELEMENTS_CLASS.DELETE.BLOCK}`,
      );
      const buttonEditConfirm: any = document.querySelector(
        `.${ELEMENTS_CLASS.SAVE.BLOCK}`,
      );
      const buttonsEditpost = containers.querySelectorAll(".button-edit-post");
      const buttonsDeletepost = containers.querySelectorAll(
        ".button-delete-post",
      );

      const modalsEdit: any = document.querySelector(".modal__editpost");
      const modalsDelete: any = document.querySelector(".modal__deletepost");

      const title: any = modalsEdit.querySelector(`.input-group`);
      const content: any = modalsEdit.querySelector(`.textarea-group`);

      const titleDelete: any = modalsDelete.querySelector(`.input-group`);
      const contentDelete: any = modalsDelete.querySelector(`.textarea-group`);

      buttonsEditpost[index].addEventListener("click", () => {
        modalsEdit.style.display = "block";
        title.textContent = posts[index].title;
        content.textContent = posts[index].content;
        containers.classList.add("blur");
      });

      console.log(buttonCancel);
      buttonCancel[1]?.addEventListener("click", () => {
        modalsEdit.style.display = "none";
        containers.classList.remove("blur");
      });
      buttonEditConfirm.addEventListener("click", () => {
        modalsEdit.style.display = "none";
        containers.classList.remove("blur");
      });

      buttonsDeletepost[index].addEventListener("click", () => {
        modalsDelete.style.display = "block";
        titleDelete.textContent = posts[index].title;
        contentDelete.textContent = posts[index].content;
        containers.classList.add("blur");
      });
      buttonCancel[2]?.addEventListener("click", () => {
        modalsDelete.style.display = "none";
        containers.classList.remove("blur");
      });
      buttonDeleteConfirm.addEventListener("click", () => {
        modalsDelete.style.display = "none";
        containers.classList.remove("blur");
      });
    });
  });
}
function handleImageUpload() {
  const button: any = document.querySelector(`.image-upload-label`);
  const profilePicInput: any = document.querySelector(`.image-upload-input`);
  const profilePic: any = document.querySelector(`.background-image`);

  // Добавляем обработчик события change к input
  profilePicInput.addEventListener("change", (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        profilePic.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Добавляем обработчик события click к кнопке
  button.addEventListener("click", () => {
    profilePicInput.click(); // Программно вызываем клик на input
  });
}
/**
 * Асинхронная функция рендеринга профиля пользователя.
 * @returns созданный элемент профиля пользователя или 0,
 * если пользователь не найден
 */
export async function renderProfile() {
  try {
    const authorData: any = await getPageAuthor(window.location.pathname);
    const authorPosts: any = await getUserPosts(window.location.pathname);
    // const authorMedias: any = await getPageMedia(window.location.pathname);
    if (!authorData) {
      throw new Error("Пользователь не найден");
    }

    const doc: any = document.body;
    doc.style.height = "100%";

    const vdom: VNode = createElement("div", { class: "main-content" }, [
      createElement("div", { class: ELEMENTS_CLASS.PROFILE.FORM }, [
        createElement("div", { class: ELEMENTS_CLASS.PROFILE.HEADER }, [
          renderVibe(authorData),
          createElement(
            "label",
            {
              class: "image-upload-label",
              type: "file",
              accept: "image/*",
              htmlFor: "image-upload", // Ссылка на скрытый input
            },
            [createText("Выбрать обложку")], // Текст кнопки
          ),
          createElement(
            "input",
            {
              id: "image-upload", // Уникальный ID для связи с label
              class: "image-upload-input",
              type: "file",
              accept: "image/*",
              style: "display: none;",
            },
            [],
          ),
          createElement("img", { class: "background-image" }, []),
        ]),
        createElement("div", { class: ELEMENTS_CLASS.PROFILE.BLOCK }, [
          renderUserInfo(authorData, null),
          createElement("div", { class: ELEMENTS_CLASS.PROFILE.RIGHT }, [
            renderUserStats(authorData, authorPosts),
            renderButtonCreatePost(),
            ...renderPosts(authorPosts),
          ]),
        ]),
      ]),
      renderSidebar(),
      renderCreatePost(),
      renderTip(),
      renderEditPost(authorPosts),
      renderDeletePost(authorPosts),
    ]);

    const container = update(pageContainer, vdom);

    const mainContent = container.querySelector(".main-content");
    modifierSidebar(mainContent);

    const containerPosts: any = container.querySelector(
      `.${ELEMENTS_CLASS.PROFILE.FORM}`,
    );
    const buttonCancel: any = container.querySelectorAll(
      `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
    );

    if (window.location.pathname === "/feed/profile") {
      const containerCreatePost = container.querySelector(".modal__createpost");
      const buttonCreatePost: any = container.querySelector(
        `.${ELEMENTS_CLASS.CREATE.BLOCK}`,
      );

      buttonCreatePost?.addEventListener("click", () => {
        containerCreatePost.style.display = "block";
        containerPosts.classList.add("blur");
      });
      buttonCancel[0]?.addEventListener("click", () => {
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
      buttonCancel[0]?.addEventListener("click", () => {
        containerTip.style.display = "none";
        containerPosts.classList.remove("blur");
      });
    }

    modifirePosts(containerPosts, authorPosts);

    const logoutbutton = container.querySelector(
      `.${ELEMENTS_CLASS.LOGOUT.BLOCK}`,
    );

    logoutbutton.addEventListener("click", (event: any) => {
      event.preventDefault();
      removeItemLocalStorage(authorData.username);
      route(LINKS.HOME.HREF);
    });

    handleImageUpload();

    return container;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}
