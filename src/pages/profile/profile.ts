import { ELEMENTS_CLASS, LINKS, LOCATIONS, QUERY, state } from "../../consts";
import { fetchAjax } from "../../utils/fetchAjax";
import { removeItemLocalStorage } from "../../utils/storages";
import { route } from "../../utils/routing";
import { renderSidebar } from "../feed/feedView";
import {
  mobileProfile,
  renderAbout,
  renderCreatePost,
  renderDeletePost,
  renderDesktopProfileHeader,
  renderDesktopProfileInfo,
  renderEditPost,
  renderTip,
  renderUserInfo,
  renderUserPosts,
} from "./profileView";
import { VNode } from "../../lib/vdom/src/source";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { pageContainer } from "../../index";
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
          localStorage.clear();
          route(LINKS.HOME.HREF);
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

      const contentDelete: any = modalsDelete.querySelector(
        `.textarea-group-delete`,
      );

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
        contentDelete.textContent = `Вы действительно хотите удалить пост "${posts[index].title}" ?`;
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
function handleImageUploadMobile() {
  const profilePicInput: any = document.querySelector(
    `.image-upload-input-mobile`,
  );
  const profilePic: any = document.querySelector(`.background-image-mobile`);

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

  const button: any = document.querySelector(`.change-cover-button-mobile`);
  const buttonUpload: any = document.getElementById("image-upload-mobile");
  button.addEventListener("click", () => {
    buttonUpload.click();
  });
}
function controlMediaProfile(container: any) {
  if (window.location.pathname === "/profile") {
    handleImageUpload();
    handleImageUploadMobile();
    const background = container.querySelector(".header-profile");
    const buttonUploadBackground = container.querySelector(
      ".image-upload-label",
    );

    background.addEventListener("mouseover", () => {
      buttonUploadBackground.style.display = "inline-block";
    });

    background.addEventListener("mouseout", () => {
      // Убираем кнопку только если курсор не над кнопкой
      if (!buttonUploadBackground.matches(":hover")) {
        buttonUploadBackground.style.display = "none";
      }
    });

    // Добавляем обработчик для кнопки, чтобы она оставалась видимой при наведении
    buttonUploadBackground.addEventListener("mouseover", () => {
      buttonUploadBackground.style.display = "inline-block";
    });

    buttonUploadBackground.addEventListener("mouseout", () => {
      buttonUploadBackground.style.display = "none";
    });

    background.addEventListener("mouseout", () => {
      const buttonUploadBackground = container.querySelector(
        ".image-upload-label",
      );
      buttonUploadBackground.style.display = "none";
    });
  }
}

function controlAdaptiveProfile(container: any) {
  const buttonMobileAbout = container.querySelector(".about-mobile__button");
  const buttonMobilePosts = container.querySelector(".posts-mobile__button");
  const feedProfile = container.querySelector(".feed-profile");
  const aboutProfile = container.querySelector(".about");

  function showFeedProfile() {
    feedProfile.classList.remove("hidden");
    aboutProfile.classList.add("hidden");
    buttonMobilePosts.classList.add(ELEMENTS_CLASS.ACTIVE);
    buttonMobileAbout.classList.remove(ELEMENTS_CLASS.ACTIVE);
  }

  function showAboutProfile() {
    aboutProfile.classList.remove("hidden");
    feedProfile.classList.add("hidden");
    buttonMobilePosts.classList.remove(ELEMENTS_CLASS.ACTIVE);
    buttonMobileAbout.classList.add(ELEMENTS_CLASS.ACTIVE);
  }

  // Изначально показываем нужный элемент в зависимости от ширины окна
  if (window.innerWidth <= 1024) {
    showAboutProfile(); // Показываем about, если это мобильное устройство
  } else {
    feedProfile.classList.remove("hidden");
    aboutProfile.classList.remove("hidden");
  }

  buttonMobileAbout.addEventListener("click", () => {
    if (window.innerWidth <= 1024) {
      showAboutProfile();
    }
  });

  buttonMobilePosts.addEventListener("click", () => {
    if (window.innerWidth <= 1024) {
      showFeedProfile();
    }
  });
}
function controlLogout(container: any, authorData: any) {
  const logoutbutton = container.querySelector(
    `.${ELEMENTS_CLASS.LOGOUT.BLOCK}`,
  );

  logoutbutton.addEventListener("click", (event: any) => {
    event.preventDefault();
    removeItemLocalStorage(authorData.username);
    route(LINKS.HOME.HREF);
  });
}
function controlAdaptivePageAuthors(container: any, containerPosts: any) {
  const buttonCancel: any = container.querySelectorAll(
    `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
  );

  if (window.location.pathname === "/profile") {
    const containerCreatePost = container.querySelector(".modal__createpost");
    const buttonCreatePost: any = container.querySelectorAll(
      `.${ELEMENTS_CLASS.CREATE.BLOCK}`,
    );
    buttonCreatePost.forEach((button: any) => {
      button.addEventListener("click", () => {
        containerCreatePost.style.display = "block";
        containerPosts.classList.add("blur");
      });
      buttonCancel[0]?.addEventListener("click", () => {
        containerCreatePost.style.display = "none";
        containerPosts.classList.remove("blur");
      });
    });
  }
  if (window.location.pathname !== "/profile") {
    const containerTip = container.querySelector(".modal__tip");
    const buttonTip = container.querySelectorAll(`.send-tip__button-new`);
    buttonTip.forEach((button: any) => {
      button.addEventListener("click", () => {
        containerTip.style.display = "block";
        containerPosts.classList.add("blur");
      });
      buttonCancel[0]?.addEventListener("click", () => {
        containerTip.style.display = "none";
        containerPosts.classList.remove("blur");
      });
    });
  }
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
    document.body.style.height = "100vh";
    state.currentUser = authorData;
    if (!authorData) {
      throw new Error("Пользователь не найден");
    }

    const vdom: VNode = createElement("div", { class: "main-content" }, [
      createElement("div", { class: "profile-form" }, [
        mobileProfile(authorData),
        renderDesktopProfileHeader(),
        createElement("div", { class: "container-profile" }, [
          renderDesktopProfileInfo(authorData),
          createElement("div", { class: "center-column-profile" }, [
            renderAbout(),
            createElement("div", { class: "feed-profile" }, [
              createElement("div", { class: "nav-tabs-profile" }, [
                createElement("a", { class: "active-profile" }, [
                  createText("Лента"),
                ]),
                createElement("a", { class: "active-profile" }, [
                  createText("Медиа"),
                ]),
              ]),
            ]),
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

    const containerPosts: any = container.querySelector(`.profile-form`);

    modifierSidebar(mainContent);

    controlAdaptivePageAuthors(container, containerPosts);

    modifirePosts(containerPosts, authorPosts);

    controlLogout(container, authorData);

    controlMediaProfile(container);

    controlAdaptiveProfile(container);

    return container;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}
