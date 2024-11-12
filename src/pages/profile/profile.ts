import { ELEMENTS_CLASS, LINKS, QUERY, state } from "../../consts";
import { fetchAjax } from "../../utils/fetchAjax";
import { removeItemLocalStorage } from "../../utils/storages";
import { route } from "../../utils/routing";
import { getAccount } from "../feed/feedView";

import {
  renderAbou,
  renderCreatePos,
  renderDelPos,
  renderEditPos,
  renderTi,
  renderUserPost,
  renderUserSt,
} from "./view";
import { VNode } from "../../lib/vdom/src/source";
import {
  createElement,
  createText,
  renderTo,
  update,
} from "../../lib/vdom/lib";
import { pageContainer } from "../../index";
import { AddLikeOnPost, modifierSidebar } from "../feed/feed";
import { convertISOToRussianDate } from "../../utils/parsedate";
import DOMPurify from "dompurify";
import { mobilepr, profileContent } from "./view";
/**
 * Получаем посты пользователя через объект типа промис
 * @param link Ссылка на страницу
 * @param offset Оффсет
 * @param limit Лимит
 * @returns
 */
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
/**
 * Добавляем пост через объект типа промис
 * @param containerCreatePost Контейнер добавления
 * @param title Заголовок
 * @param content Содержание
 * @returns
 */
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
/**
 * Получение выплат через объект типа промис
 * @param link Ссылка на страницу
 * @returns
 */
export async function getPayments(link: string) {
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
/**
 * Функция получения аватара через объект типа промис
 * @param link Ссылка на страницу
 * @param authorID Автор айди
 * @returns
 */
export async function getAvatar(link: string, authorID: any = null) {
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
/**
 * Получение фона на странице автора через объект типа промис
 * @param link Ссылка на страницу
 * @param authorID Автор айди
 * @returns
 */
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
/**
 * Функция изменения поста через объект типа промис
 * @param modalEdit Модальное окно редактирования
 * @param postIdEdit Айди редактируемого поста
 * @param titleEdit Заголовок редактирования
 * @param contentEdit Контент редактирования
 * @returns
 */
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
/**
 * Функция удаления поста через объект типа промис
 * @param postId Айди поста
 * @returns
 */
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
/**
 * Функция рендера постов
 * @param authorPosts Массив постов у текущего юзера
 * @returns
 */
async function renderPosts(authorPosts: any[]) {
  var posts: any = [];
  authorPosts.forEach(async (post: any) => {
    const container: any = await renderUserPost(post);
    const div = renderTo(container);
    posts.push(div);
  });
  return posts;
}
/**
 * Функция модифицирования каждого поста
 * @param containerPosts Контейнер с постами
 * @param posts Посты
 * @param postId Пост айди. Нужен для создания поста
 * @returns
 */
async function modifireMyPosts(
  containerPosts: any,
  posts: any,
  postId: any = null,
) {
  try {
    // Обработка популярных постов
    if (posts.length > 1) {
      const containersPost = containerPosts.querySelectorAll(`.posts`);

      // Используем Promise.all для обработки популярных постов параллельно
      await Promise.all(
        Array.from(containersPost)
          .slice(-posts.length)
          .map((container: any, index: any) => {
            return customizePostProfile(
              container,
              posts[posts.length - 1 - index],
              postId,
            );
          }),
      );
      return;
    }
    const containersPost = containerPosts.querySelectorAll(`.posts`);
    return customizePostProfile(containersPost[0], posts[0], postId);
  } catch (error) {
    console.log("ERROR");
    throw error;
  }
}
/**
 * Установка заголовка поста
 * @param container Контейнер, в котором нужно установить заголовок поста
 * @param post Пост
 */
function setTitle(container: any, post: any) {
  const title: any = container.querySelector(`.${ELEMENTS_CLASS.POST.TITLE}`);
  title.textContent = post.title;
}
/**
 * Установка содержимого поста
 * @param container Контейнер, в котором нужно установить содержимое поста
 * @param post Пост
 */
function setContent(container: any, post: any) {
  const content: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.CONTENT}`,
  );
  content.textContent = post.content;
}
/**
 * Установка даты поста
 * @param container Контейнер, в котором нужно установить дату поста
 * @param post Пост
 */
function setDate(container: any, post: any) {
  const date: any = container.querySelector(`.${ELEMENTS_CLASS.POST.DATE}`);
  date.textContent = convertISOToRussianDate(post.createdAt);
}
/**
 * Модифицирование модального окна удаления поста
 * @param dropdownmenu Меню всплытия
 * @param profileForm Форма профиля
 * @param container Контейнер поста
 * @param post Пост
 */
async function modifierModalDeletePost(
  dropdownmenu: any,
  profileForm: any,
  container: any,
  post: any,
) {
  dropdownmenu.classList.remove(ELEMENTS_CLASS.ACTIVE);
  const afteruserPosts: any = await getUserPosts(
    window.location.pathname,
    0,
    300,
  );
  const foundPost = afteruserPosts.find(
    (afteruserpost: any) => afteruserpost.postId === post.postId,
  );

  const place = document.querySelector(`.div-delete-posts`);
  const modal: any = renderDelPos(foundPost);
  update(place, modal);

  const modalsDelete: any = document.querySelector(".modal__deletepost");
  const buttonCancel: any = modalsDelete.querySelector(`.cancel`);
  const buttonConfirm: any = modalsDelete.querySelector(`.delete`);

  const contentDelete: any = document.querySelector(".textarea-group-delete");

  contentDelete.textContent = `Вы действительно хотите удалить пост "${foundPost.title}" ?`;
  modalsDelete.style.display = "block";
  profileForm.classList.add("blur");

  buttonCancel.addEventListener("click", () => {
    modalsDelete.style.display = "none";
    profileForm.classList.remove("blur");
    return;
  });

  buttonConfirm.addEventListener("click", async () => {
    modalsDelete.style.display = "none";
    profileForm.classList.remove("blur");

    await deletePost(foundPost.postId);
    container.style.display = "none";

    const placeStats: any = document.querySelector(`.stats`);
    const payments: any = await getPayments(window.location.pathname);
    const authorData: any = await getPageAuthor(window.location.pathname);
    const arrayStats: VNode = await renderUserSt(authorData, payments);
    update(placeStats, arrayStats);
    return;
  });
}
/**
 * Модифицрования модального окна редактирования поста
 * @param dropdownmenu Меню всплытия
 * @param profileForm Форма профиля
 * @param title Заголовок
 * @param content Содержимое
 * @param postbefore Предыдущий пост (если изменим содержимое постов профиля)
 * @param postId Айди поста (после создания)
 */
async function modifierModalEditPost(
  dropdownmenu: any,
  profileForm: any,
  title: any,
  content: any,
  postbefore: any,
  postId: any = null,
) {
  const alluserpost: any = await getUserPosts(window.location.pathname, 0, 300);
  let post = alluserpost.find(
    (userpost: any) => userpost.postId === postbefore.postId,
  );

  if (postId) {
    post = alluserpost[0];
  }
  dropdownmenu.classList.remove(ELEMENTS_CLASS.ACTIVE);

  const place = document.querySelector(`.div-edit-posts`);
  const modal: any = renderEditPos(post);
  update(place, modal);

  const modalsEdit: any = document.querySelector(".modal__editpost");
  const buttonCancel: any = modalsEdit.querySelector(`.cancel`);
  const buttonConfirm: any = modalsEdit.querySelector(`.save`);

  const edittitle: any = modalsEdit.querySelector(".input-group");
  const editcontent: any = modalsEdit.querySelector(".textarea-group");

  modalsEdit.style.display = "block";
  profileForm.classList.add("blur");

  buttonCancel.addEventListener("click", () => {
    modalsEdit.style.display = "none";
    profileForm.classList.remove("blur");

    return;
  });

  buttonConfirm.addEventListener("click", async () => {
    modalsEdit.style.display = "none";
    profileForm.classList.remove("blur");

    if (
      !DOMPurify.sanitize(edittitle.value) ||
      !DOMPurify.sanitize(editcontent.value)
    ) {
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
    console.log(edittitle.value);
    console.log(editcontent.value);
    await editPost(
      modalsEdit,
      postId ? postId : post.postId,
      DOMPurify.sanitize(edittitle.value),
      DOMPurify.sanitize(editcontent.value),
    );

    const afteruserPosts: any = await getUserPosts(
      window.location.pathname,
      0,
      300,
    );
    const foundPost = afteruserPosts.find(
      (afteruserpost: any) => afteruserpost.postId === post.postId,
    );
    title.textContent = foundPost.title;
    content.textContent = foundPost.content;

    if (postId) {
      const foundPostPostid = afteruserPosts.find(
        (afteruserpost: any) => afteruserpost.postId === postId,
      );
      title.textContent = foundPostPostid.title;
      content.textContent = foundPostPostid.content;
    }

    return;
  });
}
/**
 * Установка взаимодействия с лайком у поста
 * @param container Контейнер поста
 * @param post Пост
 */
function setLike(container: any, post: any) {
  const divLikes: any = container.querySelector(`.likes-container`);
  if (divLikes) {
    const amountLike: any = container.querySelector(
      `.${ELEMENTS_CLASS.POST.LIKES.AMOUNT}`,
    );
    amountLike.innerHTML = `${post.likes}`;

    // Установка состояния лайка
    if (post.isLiked) {
      divLikes.classList.add("active");
    } else {
      divLikes.classList.remove("active");
    }

    const divLike: any = container.querySelector(
      `.${ELEMENTS_CLASS.POST.LIKES.BLOCK}`,
    );

    divLike.addEventListener("click", async () => {
      if (post.isLiked) {
        // Удалить лайк
        const likeCount: any = await AddLikeOnPost(post.postId);
        post.isLiked = false; // Обновляем состояние
        post.likes = likeCount.count; // Обновляем количество лайков
        divLikes.classList.remove("active");
      } else {
        // Добавить лайк
        const likeCount: any = await AddLikeOnPost(post.postId);
        post.isLiked = true; // Обновляем состояние
        post.likes = likeCount.count; // Обновляем количество лайков
        divLikes.classList.add("active");
      }
      amountLike.innerHTML = `${post.likes}`; // Обновляем отображаемое количество лайков
    });
  }
}
/**
 * Кастомизация одного поста профиля
 * @param container Контейнер поста
 * @param post Пост
 * @param postId Айди поста
 */
function customizePostProfile(container: any, post: any, postId: any = null) {
  setTitle(container, post);

  setContent(container, post);

  setDate(container, post);

  setLike(container, post);

  const menu = container.querySelector(`.menu-icon`);
  const alldropdownMenu = document.querySelectorAll(`.dropdown-menu`);
  const dropdownmenu: any = container.querySelector(`.dropdown-menu`);
  const profileForm: any = document.querySelector(`.profile-form`);
  const title = container.querySelector(`.title`);
  const content = container.querySelector(`.content`);
  const place = document.querySelector(`.place-posts`);
  if (!menu) return;
  menu.addEventListener("click", async (event: any) => {
    if (event.target.classList.contains("button-edit-post")) {
      modifierModalEditPost(
        dropdownmenu,
        profileForm,
        title,
        content,
        post,
        postId,
      );
      return;
    }

    if (event.target.classList.contains("button-delete-post")) {
      modifierModalDeletePost(dropdownmenu, profileForm, container, post);
      return;
    }

    event.stopPropagation();

    const isActive = dropdownmenu.classList.contains(ELEMENTS_CLASS.ACTIVE);

    alldropdownMenu.forEach((dropdown: any, dropdownIndex: number) => {
      dropdown.classList.remove(ELEMENTS_CLASS.ACTIVE);
    });
    if (!isActive) {
      dropdownmenu.classList.toggle(ELEMENTS_CLASS.ACTIVE);
    }
  });
}
export function renderModalStatusUpload(ok: any, media: any) {
  const modal: any = document.querySelector(`.push-modal`);
  modal.classList.add(`active`);
  if (ok) {
    modal.textContent = `${media} успешно применен`;
    modal.style.color = "green";
  } else {
    modal.textContent = "Произошла ошибка";
    modal.style.color = "red";
  }

  const hideModal = () => {
    modal.classList.remove("active");
    clearTimeout(timeoutId);
  };

  let timeoutId: any = setTimeout(hideModal, 3000);

  modal.addEventListener("mouseenter", () => {
    clearTimeout(timeoutId);
  });

  modal.addEventListener("mouseleave", () => {
    timeoutId = setTimeout(hideModal, 3000);
  });
  modal.addEventListener("click", () => {
    modal.classList.remove("active");
  });
}
/**
 * Загрузка бекграунда
 */
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
          const media = "Фон";
          renderModalStatusUpload(ok, media);
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
/**
 * Сохранения бекграунда после загрузки
 * @param background Файл картинка
 * @returns
 */
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
 * Загрузка бекграунда с мобильного приложения
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
          const media = "Фон";
          renderModalStatusUpload(ok, media);
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
/**
 * Взаимодействие с бекграундом
 * @param container Контейнер профиля
 */
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
/**
 * Управления адаптивностью профиля
 * @param container Контейнер профиля
 */
async function controlAdaptiveProfile(container: any) {
  const buttonMobileAbout: any = document.querySelector(
    ".about-mobile__button",
  );
  const buttonMobilePosts = container.querySelector(".posts-mobile__button");

  const feedProfile: any = container.querySelector(".feed-profile");
  const aboutProfile: any = container.querySelector(".place-edit-info");
  const data: any = await getPageAuthor(window.location.pathname);

  /**
   * Функция показа ленты в профиле
   */
  function showFeedProfile() {
    buttonMobileAbout.classList.remove(ELEMENTS_CLASS.ACTIVE);
    buttonMobilePosts.classList.add(ELEMENTS_CLASS.ACTIVE);
    aboutProfile.classList.add("hidden");
    if (feedProfile) {
      feedProfile.classList.remove("hidden");
    }
  }

  /**
   * Функция показа контейнера "ПРОФИЛЬ"
   */
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
/**
 * Управления кнопкой выйти
 * @param container Контейнер основной
 * @param authorData Информация об авторе
 */
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
/**
 * Функция отправки пожертвования
 * @param authorId
 * @param body
 * @returns
 */
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
/**
 * Управление адаптивностью на странице автора
 * @param authorData Данные автора
 * @param container Контейнер основной
 * @param profileForm Форма профиля
 */
async function controlAdaptivePageAuthors(
  authorData: any,
  container: any,
  profileForm: any,
) {
  if (window.location.pathname === "/profile") {
    const buttonCreatePost: any = container.querySelectorAll(
      `.${ELEMENTS_CLASS.CREATE.BLOCK}`,
    );
    buttonCreatePost.forEach((button: any) => {
      button.addEventListener("click", () => {
        const place = document.querySelector(`.div-create-post`);
        const modal: any = renderCreatePos();
        update(place, modal);
        const containerCreatePost =
          container.querySelector(".modal__createpost");

        const buttonCancel: any = containerCreatePost.querySelector(
          `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
        );
        const buttonSave: any = containerCreatePost.querySelector(
          `.${ELEMENTS_CLASS.SEND_TIP.BLOCK}`,
        );

        containerCreatePost.style.display = "block";
        profileForm.classList.add("blur");

        buttonCancel.addEventListener("click", () => {
          containerCreatePost.style.display = "none";
          profileForm.classList.remove("blur");
          return;
        });

        buttonSave.addEventListener("click", async () => {
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
          const post: any = await addUserPost(
            containerCreatePost,
            sanitizedTitle,
            sanitizedContent,
          );
          containerCreatePost.style.display = "none";
          profileForm.classList.remove("blur");

          const newposts: any = await getUserPosts(
            window.location.pathname,
            0,
            300,
          );
          const place: any = profileForm.querySelector(".place-posts");
          place.prepend(...(await renderPosts(newposts.slice(0, 1))));
          modifireMyPosts(place, newposts.slice(0, 1), post.postId);
          console.log(newposts.slice(0, 1));
          const placeStats: any = document.querySelector(`.stats`);
          const payments: any = await getPayments(window.location.pathname);

          const arrayStats: VNode = await renderUserSt(authorData, payments);
          update(placeStats, arrayStats);
        });
      });
    });
  }
  if (window.location.pathname !== "/profile") {
    const buttonTip = container.querySelector(`.send-tip__button-new`);
    const buttonSubs: any = document.querySelector(`.follow`);

    buttonTip.addEventListener("click", () => {
      const place = document.querySelector(`.div-send-tip`);
      const modal: any = renderTi();
      update(place, modal);

      const buttonCancel: any = document.querySelector(
        `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
      );
      const buttonSend: any = document.querySelector(
        `.${ELEMENTS_CLASS.SEND_TIP.BLOCK}`,
      );

      const containerTip: any = document.querySelector(".modal__tip");
      containerTip.style.display = "block";
      profileForm.classList.add("blur");
      buttonSend.addEventListener("click", async () => {
        const messageInput = containerTip.querySelector(`.textarea-group`);
        const costInput = containerTip.querySelector(`.input-group`);
        const message = messageInput.value;
        const costString = costInput.value;
        const cost = parseInt(costString, 10);
        const userposts: any = await getUserPosts(window.location.pathname, 0);
        const ok = await sendTip(userposts[0].authorId, { message, cost });
        containerTip.style.display = "none";
        profileForm.classList.remove("blur");
      });
      buttonCancel.addEventListener("click", async () => {
        containerTip.style.display = "none";
        profileForm.classList.remove("blur");
      });
    });
    buttonSubs.addEventListener("click", async () => {
      const userdata: any = await getUserPosts(window.location.pathname, 0);
      console.log(userdata[0].authorId);
      const ok: any = await following(userdata[0].authorId);

      const placeStats: any = document.querySelector(`.stats`);
      const user: any = await getPageAuthor(window.location.pathname);
      const arrayStats: VNode = await renderUserSt(user);
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
/**
 * Функция подписки
 * @param authorId Автор айди
 * @returns
 */
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

/**
 * Изменение информации "О СЕБЕ"
 * @param info Информация
 * @returns
 */
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
/**
 * УПравление информацией "О СЕБЕ"
 * @param authorData Данные об авторе
 * @param container Контейнер "О СЕБЕ"
 * @returns
 */
function controlInfo(authorData: any, container: any) {
  if (window.location.pathname !== "/profile") {
    return 0;
  }

  // Обработчик для кнопки "Редактировать"
  container.addEventListener("click", async (event: any) => {
    if (event.target.classList.contains("edit-info-button")) {
      const currentText: any = container.querySelector(".about-profile");
      const text = currentText.textContent;
      const content = renderAbou(authorData, true, text);
      const place: any = document.querySelector(`.place-edit-info`);
      update(place, content);
    }

    if (event.target.classList.contains("save-info-button")) {
      const input = container.querySelector(`.about-input`);
      const newValue = input.value;

      // Сохраняем информацию
      try {
        const response = await setInfo(newValue);
        const newdataUser = await getPageAuthor(window.location.pathname);
        const content = renderAbou(newdataUser, false, newValue);
        const place: any = document.querySelector(`.place-edit-info`);
        update(place, content);
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
      const content = renderAbou(authorData, false, currentText);
      const place: any = document.querySelector(`.place-edit-info`);
      update(place, content);
    }
  });
}
/**
 * Функция пагинации на странице автора
 * @param allPosts Все посты
 * @param containerPosts Контейнер с постами
 */
async function paginateProfile(allPosts: any, containerPosts: any) {
  let stopLoad: boolean = false;
  let offset = 0;
  // Объект для предотвращения повторной загрузки
  let isLoading = false;
  const cache: any = {
    popular: [],
    recently: [],
  };
  /**
   * Загрузка постов в профиле
   * @returns
   */
  async function loadProfilePost() {
    if (isLoading) return; // Если загрузка уже идет, выходим из функции
    isLoading = true; // Устанавливаем флаг загрузки

    try {
      if (!stopLoad) {
        // Загружаем популярные посты
        const posts: any = await getUserPosts(window.location.pathname, offset);
        const nextPosts = posts.slice(0, QUERY.LIMIT);
        if (nextPosts.length > 0) {
          allPosts.push(...nextPosts);
          offset += QUERY.LIMIT;

          containerPosts.append(...(await renderPosts(nextPosts)));
          modifireMyPosts(containerPosts, nextPosts.reverse());
          cache.popular.push(...nextPosts);
        } else {
          stopLoad = true;
        }
      }
    } finally {
      isLoading = false;
    }
  }

  // Инициализируем загрузку первых постов
  await loadProfilePost();

  // Обработчик события прокрутки
  window.addEventListener("scroll", async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    // Проверяем, достиг ли пользователь нижней части страницы
    if (scrollTop + clientHeight >= scrollHeight - 500) {
      await loadProfilePost();
    }
  });
}

/**
 * Асинхронная функция рендеринга профиля пользователя.
 * @returns созданный элемент профиля пользователя или 0,
 * если пользователь не найден
 */
export async function renderProfile() {
  try {
    const posts: any = [];
    const authorData: any = await getPageAuthor(window.location.pathname);

    const avatar: any = await getAvatar(
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

    const vdom: any = await profileContent(
      userdata,
      authorData,
      avatar,
      background,
      payments,
    );
    const container = update(pageContainer, vdom);
    if (!vdom) {
      throw new Error("VirtualDOM не построился");
    }

    // const container = update(pageContainer, vdom);
    if (window.innerWidth <= 1024) {
      const mobileContaine2: any = await mobilepr(
        authorData,
        avatar,
        background,
        payments,
      );
      const mobile: any = document.querySelector(`.div-mobile`);
      update(mobile, await mobileContaine2);
      controlAdaptiveProfile(container);
    }

    // Отрисовка информации о пользователе
    const content = renderAbou(authorData);
    const place: any = document.querySelector(`.place-edit-info`);
    update(place, content);

    const mainContent = container.querySelector(".main-content");
    const profileForm = container.querySelector(`.profile-form`);

    modifierSidebar(mainContent);
    await controlAdaptivePageAuthors(authorData, container, profileForm);

    controlLogout(container, authorData);
    controlMediaProfile(container);

    controlInfo(authorData, container);

    const placeposts: any = container.querySelector(`.place-posts`);

    await paginateProfile(posts, placeposts);

    return container;
  } catch (error) {
    console.log("ERROR in profile");
    throw error;
  }
}
