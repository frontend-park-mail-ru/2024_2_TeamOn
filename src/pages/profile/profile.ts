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
import { customizePost, modifierSidebar } from "../feed/feed";

async function getUserPosts(link: string, offset: number) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      link === "/profile"
        ? "/api/posts/author/post/me"
        : `/api/posts/author/post/${sessionStorage.getItem("page")}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
            offset += QUERY.LIMIT;
          });
        } else if (response.status === 404) {
          reject("Пост не найден");
        } else if (response.status === 504) {
          reject("Сервер не ответил вовремя. Попробуйте позже.");
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
async function addUserPost(title: string, content: string) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      "/api/posts/post",
      { title: title, content: content },
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          reject(new Error("Ошибка валидации данных"));
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
/**
 * Получение текущей страницы профиля через объект типа промис
 * @returns Информация о пользователе
 */
async function getPageAuthor(link: string) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      link === "/profile"
        ? "/api/danya/author/me"
        : `/api/danya/author/${sessionStorage.getItem("page")}`,
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
async function getAvatarAuthor(link: string) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      link == "/profile"
        ? "/api/accounts/account/me/avatar"
        : `/api/accounts/account/${sessionStorage.getItem("page")}/avatar`,
      null,
      (response) => {
        if (response.ok) {
          response.blob().then((blob) => {
            const url = URL.createObjectURL(blob);
            resolve(url);
          });
        } else if (response.status === 500) {
          resolve("../../styles/photos/avatar/default.jpg");
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

      const buttonsEditpost = containers.querySelectorAll(".button-edit-post");
      const buttonsDeletepost = containers.querySelectorAll(
        ".button-delete-post",
      );
      buttonsEditpost.forEach((button: any) => {
        button.addEventListener("click", () => {
          renderEditPost(posts[index]);
          const modalsEdit: any = document.querySelector(".modal__editpost");
          const buttonCancel: any = modalsEdit.querySelector(
            `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
          );
          console.log(buttonCancel);
          const title: any = document.querySelector(`.input-group`);
          const content: any = document.querySelector(`.textarea-group`);
          const buttonEditConfirm: any = document.querySelector(
            `.${ELEMENTS_CLASS.SAVE.BLOCK}`,
          );
          modalsEdit.style.display = "block";
          title.textContent = posts[index].title;
          content.textContent = posts[index].content;
          containers.classList.add("blur");
          buttonCancel.addEventListener("click", () => {
            modalsEdit.style.display = "none";
            containers.classList.remove("blur");
          });
          buttonEditConfirm.addEventListener("click", () => {
            modalsEdit.style.display = "none";
            containers.classList.remove("blur");
          });
        });
      });
      buttonsDeletepost.forEach((button: any) => {
        button.addEventListener("click", () => {
          renderDeletePost(posts[index]);
          const modalsDelete: any =
            document.querySelector(`.modal__deletepost`);
          const buttonDeleteConfirm: any = modalsDelete.querySelector(
            `.${ELEMENTS_CLASS.DELETE.BLOCK}`,
          );
          const contentDelete: any = document.querySelector(
            `.textarea-group-delete`,
          );
          modalsDelete.style.display = "block";
          contentDelete.textContent = `Вы действительно хотите удалить пост "${posts[index].title}" ?`;
          containers.classList.add("blur");
          const buttonCancel: any = modalsDelete.querySelector(
            `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
          );
          buttonCancel.addEventListener("click", () => {
            modalsDelete.style.display = "none";
            containers.classList.remove("blur");
          });
          buttonDeleteConfirm.addEventListener("click", () => {
            modalsDelete.style.display = "none";
            containers.classList.remove("blur");
          });
        });
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
    window.innerWidth <= 1024 ? handleImageUploadMobile() : handleImageUpload();

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
  const buttonMobileAbout: any = document.querySelector(
    ".about-mobile__button",
  );
  const buttonMobilePosts = container.querySelector(".posts-mobile__button");
  const feedProfile = container.querySelector(".feed-profile");
  const feedProfilePost = container.querySelectorAll(".posts");
  const aboutProfile = container.querySelector(".about");

  function showFeedProfile() {
    feedProfile.classList.remove("hidden");
    feedProfilePost.forEach((post: any) => {
      post.classList.remove("hidden");
    });
    aboutProfile.classList.add("hidden");
    buttonMobilePosts.classList.add(ELEMENTS_CLASS.ACTIVE);
    buttonMobileAbout.classList.remove(ELEMENTS_CLASS.ACTIVE);
  }

  function showAboutProfile() {
    aboutProfile.classList.remove("hidden");
    feedProfile.classList.add("hidden");
    feedProfilePost.forEach((post: any) => {
      post.classList.add("hidden");
    });
    buttonMobilePosts.classList.remove(ELEMENTS_CLASS.ACTIVE);
    buttonMobileAbout.classList.add(ELEMENTS_CLASS.ACTIVE);
  }

  if (window.innerWidth <= 1024) {
    showAboutProfile();
  } else {
    feedProfile.classList.remove("hidden");
    aboutProfile.classList.remove("hidden");
  }
  if (buttonMobileAbout && buttonMobilePosts) {
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
}
export function controlLogout(container: any, authorData: any) {
  const logoutbutton = container.querySelector(
    `.${ELEMENTS_CLASS.LOGOUT.BLOCK}`,
  );
  console.log(logoutbutton);
  logoutbutton.addEventListener("click", (event: any) => {
    event.preventDefault();
    removeItemLocalStorage(authorData.username);
    route(LINKS.HOME.HREF);
  });
}
function controlAdaptivePageAuthors(container: any, containerPosts: any) {
  if (window.location.pathname === "/profile") {
    const buttonCreatePost: any = container.querySelectorAll(
      `.${ELEMENTS_CLASS.CREATE.BLOCK}`,
    );
    buttonCreatePost.forEach((button: any) => {
      button.addEventListener("click", () => {
        renderCreatePost();
        const buttonCancel: any = document.querySelector(
          `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
        );
        const buttonSend: any = document.querySelector(
          `.${ELEMENTS_CLASS.SEND_TIP.BLOCK}`,
        );
        const containerCreatePost =
          container.querySelector(".modal__createpost");
        containerCreatePost.style.display = "block";
        containerPosts.classList.add("blur");

        buttonCancel.addEventListener("click", () => {
          const containerCreatePost =
            container.querySelector(".modal__createpost");
          containerCreatePost.style.display = "none";
          containerPosts.classList.remove("blur");
        });
        buttonSend.addEventListener("click", async () => {
          const title = container.querySelector(`.input-group`);
          const content = container.querySelector(`.textarea-group`);
          const post = await addUserPost(title.value, content.value);
          const containerCreatePost =
            container.querySelector(".modal__createpost");
          containerCreatePost.style.display = "none";
          containerPosts.classList.remove("blur");

          const authorPosts: any = await getUserPosts(
            window.location.pathname,
            0,
          );
          console.log(authorPosts);
          const newDiv = document.createElement("div");
          const containerPost: VNode = renderUserPosts(post);
          update(newDiv, containerPost);
          const feedProfile: any = document.querySelector(`.feed-profile`);
          feedProfile.appendChild(newDiv);
          customizePost(containerPosts, authorPosts[0]);
        });
      });
    });
  }
  if (window.location.pathname !== "/profile") {
    const buttonTip = container.querySelector(`.send-tip__button-new`);
    buttonTip.addEventListener("click", () => {
      renderTip();
      const buttonCancel: any = document.querySelector(
        `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
      );
      const containerTip: any = document.querySelector(".modal__tip");
      containerTip.style.display = "block";
      containerPosts.classList.add("blur");

      buttonCancel.addEventListener("click", () => {
        containerTip.style.display = "none";
        containerPosts.classList.remove("blur");
      });
    });
  }
}
function renderProfileForm(
  authorData: any,
  authorPosts: any,
  avatar: any,
): VNode {
  return createElement("div", { class: "profile-form" }, [
    createElement("div", { class: "div-mobile" }, []),
    renderDesktopProfileHeader(),
    createElement("div", { class: "container-profile" }, [
      renderDesktopProfileInfo(authorData, avatar),
      createElement("div", { class: "center-column-profile" }, [
        renderAbout(),
        createElement("div", { class: "feed-profile" }, [
          createElement("div", { class: "nav-tabs-profile" }, [
            createElement("a", { class: "active-profile active" }, [
              createText("Лента"),
            ]),
          ]),
          ...renderPosts(authorPosts),
        ]),
      ]),
    ]),
  ]);
}

async function renderMainContent(
  authorData: any,
  authorPosts: any,
  avatar: any,
): Promise<VNode> {
  return createElement("div", { class: "main-content" }, [
    await renderSidebar(),
    renderProfileForm(authorData, authorPosts, avatar),
    createElement("div", { class: "div-create-post" }, []),
    createElement("div", { class: "div-send-tip" }, []),
    createElement("div", { class: "div-edit-posts" }, []),
    createElement("div", { class: "div-delete-posts" }, []),
  ]);
}
/**
 * Асинхронная функция рендеринга профиля пользователя.
 * @returns созданный элемент профиля пользователя или 0,
 * если пользователь не найден
 */
export async function renderProfile() {
  try {
    let offset = 0;
    const authorData: any = await getPageAuthor(window.location.pathname);
    // const authorData: any = state.currentUser;
    const authorPosts: any = await getUserPosts(
      window.location.pathname,
      offset,
    );
    const avatar: any = await getAvatarAuthor(window.location.pathname);

    // const authorMedias: any = await getPageMedia(window.location.pathname);
    console.log(authorPosts);
    console.log("ASDASD");
    document.body.style.height = "100%";
    state.currentUser = authorData;
    if (!authorData) {
      throw new Error("Пользователь не найден");
    }
    const vdom = await renderMainContent(authorData, authorPosts, avatar);

    if (!vdom) {
      throw new Error("VirtualDOM не построился");
    }
    const container = update(pageContainer, vdom);

    if (window.innerWidth <= 1024) {
      mobileProfile(authorData);
    }

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
    console.log("ERROR");
    throw error;
  }
}
