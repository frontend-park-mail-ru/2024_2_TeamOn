import { convertISOToRussianDate } from "../../shared/utils/parsedate";
import { renderTo, update } from "../../../lib/vdom/lib";
import {
  addUserPost,
  deletePost,
  editPost,
  //renderAddPost,
  renderDeletePost,
  //renderEditPost,
  renderUserPost,
} from "../../entities/userPost";
import { ELEMENTS_CLASS, LINKS } from "../../shared/consts/consts";
import { getUserPosts } from "../getuserposts/getUserPosts";
import DOMPurify from "dompurify";
import { getPayments } from "../getpayments/getpayments";
import { renderUserStats } from "../../entities/profileInfo/ui/ui";
import { VNode } from "lib/vdom/src/source";
import { renderTip, sendTip } from "../../entities/tip";
import { getPageAuthor } from "../getpageauthor/getpageauthor";
import { setLike } from "../../entities/likes";
import { following } from "../../entities/profileInfo";
import { route } from "../../shared/routing/routing";
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
        route(LINKS.CREATE_POST.HREF)
      });
    });
  }
  /*const place = document.querySelector(`.div-create-post`);
        //const modal: any = renderAddPost();
        //update(place, modal);
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

          const arrayStats: VNode = await renderUserStats(authorData, payments);
          update(placeStats, arrayStats);
        });
      });
    });
  }*/
  if (window.location.pathname !== "/profile") {
    const buttonTip = container.querySelector(`.send-tip__button-new`);
    const buttonSubs: any = document.querySelector(`.follow`);

    buttonTip.addEventListener("click", () => {
      const place = document.querySelector(`.div-send-tip`);
      const modal: any = renderTip();
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
/*
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
*/
/**
 * Кастомизация одного поста профиля
 * @param container Контейнер поста
 * @param post Пост
 * @param postId Айди поста
 */
export function customizePostProfile(
  container: any,
  post: any,
  postId: any = null,
) {
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
  //const modal: any = renderEditPost(post);
  // update(place, modal);

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
  const modal: any = renderDeletePost(foundPost);
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
    const arrayStats: VNode = await renderUserStats(authorData, payments);
    update(placeStats, arrayStats);
    return;
  });
}

export { controlAdaptivePageAuthors };
