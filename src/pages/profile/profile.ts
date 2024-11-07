import { ELEMENTS_CLASS, LINKS, LOCATIONS, QUERY, state } from "../../consts";
import { fetchAjax } from "../../utils/fetchAjax";
import { removeItemLocalStorage } from "../../utils/storages";
import { route } from "../../utils/routing";
import { getAccount, renderSidebar } from "../feed/feedView";
import {
  mobileProfile,
  renderAbout,
  renderCreatePost,
  renderDeletePost,
  renderDesktopProfileHeader,
  renderDesktopProfileInfo,
  renderEditPost,
  renderTip,
  renderUserPosts,
  renderUserStats,
} from "./profileView";
import { VNode } from "../../lib/vdom/src/source";
import { append, createElement, createText, update } from "../../lib/vdom/lib";
import { pageContainer } from "../../index";
import { AddLikeOnPost, modifierSidebar } from "../feed/feed";
import DOMPurify from "dompurify";

export async function getUserPosts(
  link: string,
  offset: number,
  limit: any = null,
) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      link === "/profile"
        ? `/api/posts/author/post/me?limit=${limit === null ? QUERY.LIMIT : limit}&offset=${offset}`
        : `/api/posts/author/post/${sessionStorage.getItem("authorid")}?limit=${limit === null ? QUERY.LIMIT : limit}&offset=${offset}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
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
async function addUserPost(
  containerCreatePost: any,
  title: string,
  content: string,
) {
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
          response.json().then((data) => {
            const input = containerCreatePost.querySelector(`.form-group`);
            const error = input.querySelector("p");
            if (!error) {
              const error = document.createElement("p");
              error.style.color = "red";
              error.textContent = data.message;
              input.appendChild(error);
            }
          });
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
export async function getPageAuthor(link: string) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      link === "/profile"
        ? "/api/danya/author/me"
        : `/api/danya/author/${sessionStorage.getItem("authorid")}`,
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
async function getPayments(link: string) {
  return new Promise((resolve, reject) => {
    if (link !== "/profile") {
      resolve(false);
    }
    fetchAjax("GET", "/api/danya/author/payments", null, (response) => {
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
    });
  });
}
export async function getAvatarAuthor(link: string, authorID: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      link == "/profile"
        ? "/api/accounts/account/me/avatar"
        : `/api/accounts/account/${authorID}/avatar`,
      null,
      (response) => {
        if (response.ok) {
          response.blob().then((blob) => {
            const url = URL.createObjectURL(blob);
            resolve(url);
          });
        } else if (response.status === 500) {
          resolve(
            "https://github.com/frontend-park-mail-ru/2024_2_TeamOn/blob/ts/src/styles/photos/avatar/default.jpg?raw=true",
          );
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}
export async function getBackgroundAuthor(link: string, authorID: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      link == "/profile"
        ? "/api/danya/author/me/background"
        : `/api/danya/author/${authorID}/background`,
      null,
      (response) => {
        if (response.ok) {
          response.blob().then((blob) => {
            const url = URL.createObjectURL(blob);
            resolve(url);
          });
        } else if (response.status === 500) {
          resolve("https://cdn1.ozone.ru/s3/multimedia-p/6062969785.jpg");
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
async function editPost(
  modalEdit: any,
  postIdEdit: any,
  titleEdit: any,
  contentEdit: any,
) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/posts/post/update`,
      {
        postId: postIdEdit,
        title: titleEdit,
        content: contentEdit,
      },
      (response) => {
        if (response.ok) {
          resolve(false);
        } else if (response.status === 400) {
          response.json().then((data: any) => {
            const input = modalEdit.querySelector(`.form-group`);
            const error = document.createElement("p");
            error.style.color = "red";
            error.textContent = data.message;
            input.appendChild(error);
          });
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}
async function deletePost(postId: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "DELETE",
      `/api/posts/delete/post/${postId}`,
      null,
      (response) => {
        if (response.ok) {
          resolve(false);
        } else if (response.status === 400) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}
function renderPosts(authorPosts: any[]) {
  var posts: any = [];
  authorPosts.forEach(async (post: any) => {
    const container: VNode = renderUserPosts(post);
    posts.push(container);
  });
  return posts;
}
function modifireOnePost(body: any, post: any) {
  document.body.addEventListener("click", () => {
    body.dropdownmenu.classList.remove(ELEMENTS_CLASS.ACTIVE);
  });
  post.isLiked
    ? body.like.classList.add("active")
    : body.like.classList.remove("active");

  body.like.addEventListener("click", async () => {
    const likeCount: any = await AddLikeOnPost(post.postId);
    body.like.classList.toggle("active");
    body.amounlike.innerHTML = `${post.likes}`;
  });

  function handleClick(event: any) {
    event.stopPropagation();
    event.target.removeEventListener("click", handleClick);
    body.dropdownmenu.classList.toggle(ELEMENTS_CLASS.ACTIVE);
  }

  body.menu.addEventListener("click", handleClick);

  renderDeletePost(post);
  renderEditPost(post);

  const modalsEdit: any = document.querySelector(".modal__editpost");
  const modalsDelete: any = document.querySelector(".modal__deletepost");

  const resetModalStates = (event: any = null) => {
    modalsEdit.style.display = "none";
    modalsDelete.style.display = "none";
    // containers.classList.remove("blur");
    event.target.removeEventListener("click", handleClick);
  };

  const buttonEdit: any = document.querySelector(`.button-edit-post`);
  const buttonSave: any = document.querySelector(
    `.${ELEMENTS_CLASS.SAVE.BLOCK}`,
  );

  const buttonDelete: any = document.querySelector(`.button-delete-post`);
  const title: any = document.querySelector(".input-group");
  const content: any = document.querySelector(".textarea-group");

  function handleClickEdit(event: any) {
    event.stopPropagation();
    event.target.removeEventListener("click", handleClickEdit);
    body.dropdown.classList.remove(ELEMENTS_CLASS.ACTIVE);

    title.textContent = post.title;
    content.value = post.content;
    modalsEdit.style.display = "block";
  }
  modalsEdit.addEventListener("click", handleClickEdit);

  async function handleClickSave(event: any) {
    event.stopPropagation();
    event.target.removeEventListener("click", handleClickSave);

    await editPost(
      modalsEdit,
      post.postId,
      DOMPurify.sanitize(title.value),
      DOMPurify.sanitize(content.value),
    );
    resetModalStates();
    // const postsUser: any = await getUserPosts(window.location.pathname,0);
    return;
  }

  buttonSave.addEventListener("click", handleClickSave);
}
function modifirePosts(containers: any, posts: any[], offset: any) {
  const dropdownMenu = containers.querySelectorAll(`.dropdown-menu`);

  document.body.addEventListener("click", () => {
    dropdownMenu.forEach((dropdown: any) => {
      dropdown.classList.remove(ELEMENTS_CLASS.ACTIVE);
    });
  });

  const divsLike: any = containers.querySelectorAll(
    `.${ELEMENTS_CLASS.POST.LIKES.BLOCK}`,
  );

  // Установка состояния лайка
  divsLike.forEach((divLike: any, index: number) => {
    if (index < posts.length) {
      // ****
      if (posts[index].isLiked) {
        divLike.classList.add("active");
      } else {
        divLike.classList.remove("active");
      }

      const amountsLike: any = containers.querySelectorAll(
        `.${ELEMENTS_CLASS.POST.LIKES.AMOUNT}`,
      );

      divLike.addEventListener("click", async () => {
        const likeCount: any = await AddLikeOnPost(posts[index].postId);
        posts[index].likes = likeCount.count; // Обновляем количество лайков
        divLike.classList.toggle("active");
        amountsLike[index].innerHTML = `${posts[index].likes}`; // Обновляем отображаемое количество лайков
      });
    }
  });
  const menu = containers.querySelectorAll(`.menu-icon`);
  const handleMenuClick = (event: any, index: number) => {
    event.stopPropagation();
    event.target.removeEventListener("click", handleMenuClick);

    if (index < posts.length) {
      dropdownMenu.forEach((dropdown: any, dropdownIndex: number) => {
        if (dropdownIndex !== index) {
          dropdown.classList.remove(ELEMENTS_CLASS.ACTIVE);
        }
      });

      dropdownMenu[index].classList.toggle(ELEMENTS_CLASS.ACTIVE);
      renderDeletePost(posts[index]);
      renderEditPost(posts[index]);
      const modalsEdit: any = document.querySelector(".modal__editpost");
      const modalsDelete: any = document.querySelector(".modal__deletepost");

      const resetModalStates = () => {
        modalsEdit.style.display = "none";
        modalsDelete.style.display = "none";
        containers.classList.remove("blur");
        event.target.removeEventListener("click", handleMenuClick);
      };

      if (event.target.classList.contains("button-edit-post")) {
        const title: any = document.querySelector(".input-group");
        const content: any = document.querySelector(".textarea-group");

        title.textContent = posts[index].title;
        content.value = posts[index].content;
        modalsEdit.style.display = "block";
        containers.classList.add("blur");

        modalsEdit.querySelector(`.${ELEMENTS_CLASS.CANCEL.BLOCK}`).onclick =
          resetModalStates;
        const sanitizedTitle = DOMPurify.sanitize(title.value);
        const sanitizedContent = DOMPurify.sanitize(content.value);

        if (!sanitizedTitle || !sanitizedContent) {
          const input = modalsEdit.querySelector(`.form-group`);
          const error = input.querySelector("p");
          if (!error) {
            const error = document.createElement("p");
            error.style.color = "red";
            error.textContent = "Ошибка";
            input.appendChild(error);
          }
          return;
        }
        modalsEdit.querySelector(`.${ELEMENTS_CLASS.SAVE.BLOCK}`).onclick =
          async (e: any) => {
            e.preventDefault();
            await editPost(
              modalsEdit,
              posts[index].postId,
              DOMPurify.sanitize(title.value),
              DOMPurify.sanitize(content.value),
            );
            resetModalStates();
            await updatePosts();
          };
      }

      if (event.target.classList.contains("button-delete-post")) {
        const contentDelete: any = document.querySelector(
          ".textarea-group-delete",
        );
        contentDelete.textContent = `Вы действительно хотите удалить пост "${posts[index].title}" ?`;
        modalsDelete.style.display = "block";
        containers.classList.add("blur");

        modalsDelete.querySelector(`.${ELEMENTS_CLASS.CANCEL.BLOCK}`).onclick =
          resetModalStates;

        modalsDelete.querySelector(`.${ELEMENTS_CLASS.DELETE.BLOCK}`).onclick =
          async () => {
            await deletePost(posts[index].postId);
            await updatePosts();
            resetModalStates();
          };
      }
    }
  };

  const removeMenuClickHandlers = async () => {
    menu.forEach((menuElement: any, index: number) => {
      const menuClickHandler = (event: any) => handleMenuClick(event, index);
      menuElement.removeEventListener("click", menuClickHandler); // Удаляем обработчик
    });
  };

  const addMenuClickHandlers = async () => {
    menu.forEach((menuElement: any, index: number) => {
      // Создаем ссылку на обработчик
      const menuClickHandler = (event: any) => handleMenuClick(event, index);
      menuElement.addEventListener("click", menuClickHandler); // Добавляем новый обработчик
    });
  };

  // Изначально добавляем обработчики клика на меню
  addMenuClickHandlers();

  const updatePosts = async () => {
    const newPosts: any = await getUserPosts(window.location.pathname, 0);
    const arrayPost: VNode = createElement("div", {}, [
      ...renderPosts(newPosts),
    ]);
    removeMenuClickHandlers();
    // document.removeEventListener("click", handleMenuClick);
    update(containers, arrayPost);
    const placeStats: any = document.querySelector(`.stats`);
    const payments: any = await getPayments(window.location.pathname);
    const authorData: any = await getPageAuthor(window.location.pathname);
    const arrayStats: VNode = await renderUserStats(authorData, payments);
    update(placeStats, arrayStats);
    // return;

    // Добавляем обработчики клика на меню снова после обновления постов
    addMenuClickHandlers();
  };
}

function handleImageUpload() {
  const button: any = document.querySelector(`.image-upload-label`);
  const profilePicInput: any = document.querySelector(`.image-upload-input`);
  const profilePic: any = document.querySelector(`.background-image`);

  // Добавляем обработчик события change к input
  profilePicInput.addEventListener("change", async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Обработчик события load
      reader.onload = async function (e: any) {
        profilePic.src = e.target.result;

        // Создаем FormData и добавляем файл
        const formData = new FormData();
        formData.append("file", file); // Добавляем файл в FormData

        // Отправляем данные на сервер
        try {
          const ok: any = await saveBackground(formData);
        } catch (error) {
          console.error("Ошибка при загрузке фонового изображения:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  });

  // Добавляем обработчик события click к кнопке
  button.addEventListener("click", () => {
    profilePicInput.click(); // Программно вызываем клик на input
  });
}
async function saveBackground(background: FormData) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      "/api/danya/author/update/background",
      background,
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 401) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
/**
 * Обновление бекграунда
 */
function handleImageUploadMobile() {
  const profilePicInput: any = document.querySelector(
    `.image-upload-input-mobile`,
  );
  const profilePic: any = document.querySelector(`.background-image-mobile`);

  // Добавляем обработчик события change к input
  profilePicInput.addEventListener("change", async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Обработчик события load
      reader.onload = async function (e: any) {
        profilePic.src = e.target.result;

        // Создаем FormData и добавляем файл
        const formData = new FormData();
        formData.append("file", file); // Добавляем файл в FormData

        // Отправляем данные на сервер
        try {
          const ok: any = await saveBackground(formData);
        } catch (error) {
          console.error("Ошибка при загрузке фонового изображения:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  });

  const button: any = document.querySelector(`.change-cover-button-mobile`);
  const buttonUpload: any = document.getElementById("image-upload-mobile");
  button.addEventListener("click", () => {
    buttonUpload.click(); // Программно вызываем клик на input
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

async function controlAdaptiveProfile(container: any) {
  const buttonMobileAbout: any = document.querySelector(
    ".about-mobile__button",
  );
  const buttonMobilePosts = container.querySelector(".posts-mobile__button");

  const feedProfile: any = container.querySelector(".feed-profile");
  const aboutProfile: any = container.querySelector(".place-edit-info");
  const data: any = await getPageAuthor(window.location.pathname);
  function showFeedProfile() {
    buttonMobileAbout.classList.remove(ELEMENTS_CLASS.ACTIVE);
    buttonMobilePosts.classList.add(ELEMENTS_CLASS.ACTIVE);
    aboutProfile.classList.add("hidden");
    // if (data && !data.isSubscribe) {
    //   return;
    // }
    if (feedProfile) {
      feedProfile.classList.remove("hidden");
    }
  }

  function showAboutProfile() {
    aboutProfile.classList.remove("hidden");
    if (feedProfile) {
      feedProfile.classList.add("hidden");
    }
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
  logoutbutton.addEventListener("click", (event: any) => {
    event.preventDefault();
    removeItemLocalStorage(authorData.username);
    route(LINKS.HOME.HREF);
  });
}
async function sendTip(authorId: any, body: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/danya/author/${authorId}/tip`,
      { message: body.message, cost: body.cost },
      (response) => {
        if (response.ok) {
          resolve(true);
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
async function controlAdaptivePageAuthors(
  authorData: any,
  container: any,
  containerPosts: any,
) {
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
          const containerCreatePost =
            container.querySelector(".modal__createpost");
          const sanitizedTitle = DOMPurify.sanitize(title.value);
          const sanitizedContent = DOMPurify.sanitize(content.value);

          if (!sanitizedTitle || !sanitizedContent) {
            const input = containerCreatePost.querySelector(`.form-group`);
            const error = input.querySelector("p");
            if (!error) {
              const error = document.createElement("p");
              error.style.color = "red";
              error.textContent = "Ошибка";
              input.appendChild(error);
            }
            return;
          }
          const post = await addUserPost(
            containerCreatePost,
            sanitizedTitle,
            sanitizedContent,
          );
          containerCreatePost.style.display = "none";
          containerPosts.classList.remove("blur");

          const newposts: any = await getUserPosts(window.location.pathname, 0);
          const arrayPost: VNode = createElement("div", {}, [
            ...renderPosts(newposts),
          ]);
          const DIV: any = document.createElement("div");
          const place: any = containerPosts.querySelector(".place-posts");
          // update(place, arrayPost);

          const placeStats: any = document.querySelector(`.stats`);
          const payments: any = await getPayments(window.location.pathname);

          const arrayStats: VNode = await renderUserStats(authorData, payments);
          update(placeStats, arrayStats);

          update(place, arrayPost);
        });
      });
    });
  }
  if (window.location.pathname !== "/profile") {
    const buttonTip = container.querySelector(`.send-tip__button-new`);
    const buttonSubs: any = document.querySelector(`.follow`);

    buttonTip.addEventListener("click", () => {
      renderTip();
      const buttonCancel: any = document.querySelector(
        `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
      );
      const buttonSend: any = document.querySelector(
        `.${ELEMENTS_CLASS.SEND_TIP.BLOCK}`,
      );

      const containerTip: any = document.querySelector(".modal__tip");
      containerTip.style.display = "block";
      containerPosts.classList.add("blur");
      buttonSend.addEventListener("click", async () => {
        const messageInput = containerTip.querySelector(`.textarea-group`);
        const costInput = containerTip.querySelector(`.input-group`);
        const message = messageInput.value;
        const costString = costInput.value;
        const cost = parseInt(costString, 10);
        const userposts: any = await getUserPosts(window.location.pathname, 0);
        const ok = await sendTip(userposts[0].authorId, { message, cost });
        containerTip.style.display = "none";
        containerPosts.classList.remove("blur");
      });
      buttonCancel.addEventListener("click", async () => {
        containerTip.style.display = "none";
        containerPosts.classList.remove("blur");
      });
    });
    // console.log(authorId);
    buttonSubs.addEventListener("click", async () => {
      const userdata: any = await getUserPosts(window.location.pathname, 0);
      const ok: any = await following(userdata[0].authorId);

      const placeStats: any = document.querySelector(`.stats`);
      const user: any = await getPageAuthor(window.location.pathname);
      const arrayStats: VNode = await renderUserStats(user);
      update(placeStats, arrayStats);

      const userdataSec: any = await getPageAuthor(window.location.pathname);
      if (userdataSec.isSubscribe) {
        const feedProfile: any = document.querySelector(`.place-posts`);
        feedProfile.style.display = "block";
        buttonSubs.textContent = "Подписаны";
      } else {
        const feedProfile: any = document.querySelector(`.place-posts`);
        feedProfile.style.display = "none";
        buttonSubs.textContent = "Подписаться";
      }
    });
  }
}
async function following(authorId: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/danya/author/${authorId}/following`,
      null,
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 400) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}
async function renderProfileForm(
  authorData: any,
  avatar: any,
  background: any,
  payments: any,
): Promise<VNode> {
  return createElement("div", { class: "profile-form" }, [
    createElement("div", { class: "div-mobile" }, []),
    renderDesktopProfileHeader(background),
    createElement("div", { class: "container-profile" }, [
      await renderDesktopProfileInfo(authorData, avatar, payments),
      createElement("div", { class: "center-column-profile" }, [
        createElement("div", { class: "place-edit-info" }, []),
        window.location.pathname === "/profile"
          ? createElement("div", { class: "feed-profile" }, [
              createElement("div", { class: "nav-tabs-profile" }, [
                createElement("a", { class: "active-profile active" }, [
                  createText("Лента"),
                ]),
              ]),
              createElement("div", { class: "place-posts" }, []),
            ])
          : createElement("div", { class: "feed-profile" }, [
              createElement("div", { class: "nav-tabs-profile" }, [
                createElement("a", { class: "active-profile active" }, [
                  createText("Лента"),
                ]),
              ]),
              createElement(
                "div",
                {
                  class: "place-posts",
                  style: authorData.isSubscribe
                    ? "display: block"
                    : "display: none",
                },
                [],
              ),
            ]),
      ]),
    ]),
  ]);
}
async function setInfo(info: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/danya/author/update/info`,
      { info: info },
      (response) => {
        if (response.ok) {
          resolve(true);
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
function controlInfo(authorData: any, container: any) {
  if (window.location.pathname !== "/profile") {
    return 0;
  }

  // Обработчик для кнопки "Редактировать"
  container.addEventListener("click", async (event: any) => {
    if (event.target.classList.contains("edit-info-button")) {
      const currentText: any = container.querySelector(".about-profile");
      const text = currentText.textContent;
      renderAbout(authorData, true, text);
    }

    if (event.target.classList.contains("save-info-button")) {
      const input = container.querySelector(`.about-input`);
      const newValue = input.value;

      // Сохраняем информацию
      try {
        const response = await setInfo(newValue);
        const newdataUser = await getPageAuthor(window.location.pathname);
        renderAbout(newdataUser, false, newValue);
      } catch (error) {
        console.error("Ошибка при обновлении информации:", error);
      }
    }

    if (event.target.classList.contains("cancel-info-button")) {
      const input = container.querySelector(`.about-input`);
      const currentText = input.value;
      if (!DOMPurify.sanitize(currentText)) {
        return;
      }
      renderAbout(authorData, false, currentText);
    }
  });
}

function renderPostsAuthor(posts: any) {
  var allposts: any = [];
  posts.forEach(async (post: any) => {
    const container: any = await renderUserPosts(post);
    allposts.push(container);
  });
  return allposts;
}

async function renderMainContent(
  authorData: any,
  avatar: any,
  background: any,
  userdata: any,
  payments: any,
): Promise<VNode> {
  return createElement("div", { class: "main-content" }, [
    await renderSidebar(userdata),
    await renderProfileForm(authorData, avatar, background, payments),
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
    let isLoading = false; // Флаг для отслеживания загрузки постов

    const authorData: any = await getPageAuthor(window.location.pathname);
    let authorPosts: any = await getUserPosts(window.location.pathname, offset);

    let allUserPosts: any = [];
    const avatar: any = await getAvatarAuthor(
      window.location.pathname,
      sessionStorage.getItem("authorid"),
    );
    const background: any = await getBackgroundAuthor(
      window.location.pathname,
      sessionStorage.getItem("authorid"),
    );
    const userdata: any = await getAccount();
    const payments: any = await getPayments(window.location.pathname);

    document.body.style.height = "100%";
    state.currentUser = authorData;

    if (!authorData) {
      throw new Error("Пользователь не найден");
    }

    const vdom = await renderMainContent(
      authorData,
      avatar,
      background,
      userdata,
      payments,
    );

    if (!vdom) {
      throw new Error("VirtualDOM не построился");
    }

    const container = update(pageContainer, vdom);
    if (window.innerWidth <= 1024) {
      const mobileContaine = await mobileProfile(
        authorData,
        avatar,
        background,
        payments,
      );
      controlAdaptiveProfile(container);
    }

    // Отрисовка информации о пользователе
    renderAbout(authorData);

    const mainContent = container.querySelector(".main-content");
    const containerPosts = container.querySelector(`.profile-form`);

    modifierSidebar(mainContent);
    controlAdaptivePageAuthors(authorData, container, containerPosts);

    controlLogout(container, authorData);
    controlMediaProfile(container);

    controlInfo(authorData, container);

    const place = container.querySelector(`.place-posts`);
    const arrayPost: VNode = createElement("div", {}, [
      ...renderPosts(authorPosts),
    ]);
    update(place, arrayPost);

    const divLikes: any = place.querySelectorAll(
      `.${ELEMENTS_CLASS.POST.LIKES.BLOCK}`,
    );
    const dropdownMenus: any = place.querySelectorAll(`.dropdown-menu`);
    const amountsLike: any = place.querySelectorAll(
      `.${ELEMENTS_CLASS.POST.LIKES.AMOUNT}`,
    );
    const menu: any = place.querySelectorAll(`.menu-icon`);

    modifirePosts(place, authorPosts, offset);
    offset += QUERY.LIMIT;
    allUserPosts.push(...authorPosts);
    // Обработчик события прокрутки

    window.addEventListener("scroll", async () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 500 && !isLoading) {
        isLoading = true;
        const newPosts: any = await getUserPosts(
          window.location.pathname,
          offset,
        );
        allUserPosts.push(...newPosts);
        if (newPosts.length > 0) {
          const arrayPost: VNode = createElement("div", {}, [
            ...renderPosts(newPosts),
          ]);
          const newdiv: any = document.createElement("div");
          update(newdiv, arrayPost);
          place.append(newdiv);
        }

        modifirePosts(place, allUserPosts, offset);
        offset += QUERY.LIMIT;
        isLoading = false;
      }
    });

    return container;
  } catch (error) {
    console.log("ERROR");
    throw error;
  }
}
