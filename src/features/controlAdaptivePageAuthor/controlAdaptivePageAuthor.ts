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
import { ELEMENTS_CLASS, LINKS, state } from "../../shared/consts/consts";
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
import { containerMediaPost } from "../../widgest/feed/ui/post/post";
import {
  controlSlideShow,
  modifireComments,
  paginateComments,
  renderComments,
  setCapture,
} from "../paginateFeed/paginateFeed";
import { hasLogged } from "../../shared/utils/hasLogged";
import { showOverlay } from "../../shared/overlay/overlay";
import { setStatic } from "../../shared/getStatic/getStatic";
import { urlIconComment, urlIconLike, urlSendComment } from "../../app";
import { getPopularPosts } from "../getPopularPosts/getPopularPosts";
import { getAvatar } from "../getavatar/getavatar";
import { addComment } from "../../entities/comments/api/api";

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
        route(LINKS.CREATE_POST.HREF);
      });
    });
  }
  if (window.location.pathname !== "/profile") {
    const buttonTip = container.querySelector(`.send-tip__button-new`);

    buttonTip.addEventListener("click", () => {
      if (!hasLogged()) {
        route(LINKS.LOGIN.HREF);
        return;
      }
      const place = document.querySelector(`.div-send-tip`);
      const modal: any = renderTip();
      update(place, modal);

      const containerTip: any = document.querySelector(".modal__tip");
      const overlay: any = showOverlay(containerTip, profileForm);

      const buttonCancel: any = document.querySelector(
        `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
      );
      const buttonSend: any = document.querySelector(
        `.${ELEMENTS_CLASS.SEND_TIP.BLOCK}`,
      );

      containerTip.style.display = "block";
      profileForm.classList.add("blur");

      buttonSend.addEventListener("click", async (event: any) => {
        event.preventDefault();
        const messageInput = containerTip.querySelector(`.textarea-group`);
        const costInput = containerTip.querySelector(`.input-group`);
        const message = messageInput.value;
        const costString = costInput.value;

        const sanitizedMessage = DOMPurify.sanitize(messageInput.value);
        const sanitizedCost = DOMPurify.sanitize(costInput.value);

        const input = containerTip.querySelectorAll(`.form-group`)[1];
        if (sanitizedMessage == "" || sanitizedCost == "") {
          const error = input.querySelector("p");
          if (!error) {
            const error = document.createElement("p");
            error.style.color = "red";
            error.textContent = "Ошибка. Поля не могут быть пустыми";
            input.appendChild(error);
          }
          return;
        }

        let error = input.querySelector("p");
        if (error) {
          error.remove();
        }
        if (!Number.isInteger(Number(sanitizedCost))) {
          const input = containerTip.querySelectorAll(`.form-group`)[1];
          const error = input.querySelector("p");
          if (!error) {
            const error = document.createElement("p");
            error.style.color = "red";
            error.textContent = "Ошибка. Введите целое число";
            input.appendChild(error);
          }
          return;
        }
        const cost = parseInt(sanitizedCost, 10);
        if (cost < 10) {
          const input = containerTip.querySelectorAll(`.form-group`)[1];
          const error = input.querySelector("p");
          if (!error) {
            const error = document.createElement("p");
            error.style.color = "red";
            error.textContent = "Минимум 10 рублей";
            input.appendChild(error);
          }
          return;
        } else if (!cost) {
          const input = containerTip.querySelectorAll(`.form-group`)[1];
          const error = input.querySelector("p");
          if (!error) {
            const error = document.createElement("p");
            error.style.color = "red";
            error.textContent = "Ошибка. Не менее 10 рублей";
            input.appendChild(error);
          }
          return;
        }

        const authorId = sessionStorage.getItem("authorid");

        const ok = await sendTip(authorId, {
          sanitizedMessage,
          cost,
        });
        containerTip.style.display = "none";
        profileForm.classList.remove("blur");
        document.body.style.overflow = "auto";
        overlay.remove();
      });
      buttonCancel.addEventListener("click", async () => {
        overlay.remove();
        containerTip.style.display = "none";
        profileForm.classList.remove("blur");
        document.body.style.overflow = "auto";
      });
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
 * Кастомизация одного поста профиля
 * @param container Контейнер поста
 * @param post Пост
 * @param postId Айди поста
 */
export async function customizePostProfile(
  container: any,
  post: any,
  postId: any = null,
) {
  const iconLike: any = container.querySelector(`.likes`);
  const iconComment: any = container.querySelector(`.comments`);

  setStatic(iconLike, urlIconLike);
  setStatic(iconComment, urlIconComment);
  
  setTitle(container, post);

  setContent(container, post);

  setDate(container, post);

  setLike(container, post);

  setComments(container, post);

  setCapture(container);

  const key = new Set();

  const menu = container.querySelector(`.menu-icon`);
  const alldropdownMenu = document.querySelectorAll(`.dropdown-menu`);
  const dropdownmenu: any = container.querySelector(`.dropdown-menu`);
  const profileForm: any = document.querySelector(`.profile-form`);
  const title = container.querySelector(`.title`);
  const content = container.querySelector(`.content`);
  const place = document.querySelector(`.place-posts`);
  const buttonedit: any = dropdownmenu.querySelector(`.button-edit-post`);
  const buttondelete: any = dropdownmenu.querySelector(`.button-delete-post`);
  const mediaPlace: any = container.querySelector(`.container-image-photos`);

  // mediaPlace.append(...await containerMediaPost(post.postId));
  if (!menu) return;
  const handleClickMenu = async (event: any) => {
    if (event.target.classList.contains("button-edit-post")) {
      state.currentPostId = post;
      if (!state.currentPostId) return;
      route(LINKS.UPDATE_POST.HREF);
      menu.removeEventListener("click", handleClickMenu);
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
  };
  menu.addEventListener("click", handleClickMenu);
  const rightContainer = document.querySelector(`.profile-form`);
  controlSlideShow(container, rightContainer);
}
export function setComments(container: any, post: any) {
  const divComments: any = container.querySelector(`.comments-container`);
  const text = container.querySelector(`.textarea-group`);
  const handleInput = () => {
    const input = container.querySelector(`.form-group-add`);
    const error = input.querySelector("p");
    if (error) {
      error.remove();
    }
  };
  const handleClickKeySendComment = async (e: any) => {
    if (e.key === "Enter" && e.shiftKey) return;
    if (e.key === "Enter") {
      e.preventDefault();
      sendComment();
    }
  };
  text.addEventListener("keydown", handleClickKeySendComment);
  text.addEventListener("input", handleInput);
  const sendComment = async () => {
    if (!hasLogged()) {
      route(LINKS.LOGIN.HREF);
      return;
    }
    const placeContent = container.querySelector(`.place-content`);
    const formGroup = container.querySelector(`.form-group-comment`);

    // const response: any = await sendComment();
    try {
      const post: any = await addComment(formGroup, text.value, text.value, 0);
      if (!post || post.message) {
        const input = container.querySelector(`.form-group-add`);
        const error = input.querySelector("p");
        if (!error) {
          const error = document.createElement("p");
          error.style.color = "red";
          error.textContent = post.message;
          input.appendChild(error);
        }
        return;
      }
    } catch (error) {
      console.error(error);
    }
    const comments: any = await getUserPosts("/profile", 0);

    placeContent.append(...(await renderComments([comments[0]])));
    modifireComments(placeContent, [comments[0]]);
  };
  const handleClickButtonSendComment = async (e: any) => {
    e.preventDefault();
    sendComment();
  };

  if (divComments) {
    const divLoader: any = container.querySelector(`.comments-loader`);
    const loader: any = container.querySelector(`.loader__search`);
    const formComment: any = container.querySelector(`.form-group-comment`);
    const amountComments: any = container.querySelector(`.amount-comments`);
    amountComments.innerHTML = `${post.comments}`;

    divComments.addEventListener(`click`, async () => {
      const placeComments: any = container.querySelector(`.place-comments`);
      if (placeComments.style.display == "none") {
        placeComments.style.display = "block";
        divLoader.style.display = "block";
        loader.style.display = "flex";
        try {
          const allComments: any = await getPopularPosts(0);
          const avatar: any = formComment.querySelector(`.author-avatar`);
          const avatarload: any = await getAvatar("/profile");
          avatar.src = avatarload;
          const activeRequests = new Set();
          const placeContent = container.querySelector(`.place-content`);
          await paginateComments(activeRequests, [], placeContent);
        } finally {
          divLoader.style.display = "none";
          loader.style.display = "none";
          formComment.style.display = "flex";
        }
        const buttonSendComment: any =
          container.querySelector(`.button-send-comment`);
        setStatic(buttonSendComment, urlSendComment);
        buttonSendComment.addEventListener(
          "click",
          handleClickButtonSendComment,
        );
      } else {
        placeComments.style.display = "none";
        const allItems: any =
          placeComments.querySelectorAll(`.container-comment`);
        allItems.forEach((item: any) => {
          item.remove();
        });
      }
    });
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
  const modal: any = renderDeletePost(foundPost);
  update(place, modal);

  const modalsDelete: any = document.querySelector(".modal__deletepost");
  const overlay: any = showOverlay(modalsDelete, profileForm);

  const buttonCancel: any = modalsDelete.querySelector(`.cancel`);
  const buttonConfirm: any = modalsDelete.querySelector(`.delete`);

  const contentDelete: any = document.querySelector(".textarea-group-delete");

  contentDelete.textContent = `Вы действительно хотите удалить пост "${foundPost.title}" ?`;
  modalsDelete.style.display = "block";
  profileForm.classList.add("blur");

  const handleClickCancel = () => {
    modalsDelete.style.display = "none";
    profileForm.classList.remove("blur");
    overlay.remove();
    return;
  };
  buttonCancel.addEventListener("click", handleClickCancel);
  overlay.addEventListener("click", handleClickCancel);

  buttonConfirm.addEventListener("click", async () => {
    modalsDelete.style.display = "none";
    profileForm.classList.remove("blur");

    await deletePost(foundPost.postId);
    container.style.display = "none";
    overlay.remove();

    const placeStats: any = document.querySelector(`.stats`);
    const payments: any = await getPayments(window.location.pathname);
    const authorData: any = await getPageAuthor(window.location.pathname);
    const arrayStats: VNode = await renderUserStats(authorData, payments);
    update(placeStats, arrayStats);
    return;
  });
}

export { renderPosts, controlAdaptivePageAuthors };
