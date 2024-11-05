import { ELEMENTS_CLASS } from "../../consts";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { calculateAmountPosts } from "../../utils/calculateAmountPosts";
import { VNode } from "../../lib/vdom/src/source";
import { getAccount } from "../feed/feedView";
import { getUserPosts } from "./profile";

function renderUserPosts(post: any) {
  const container = document.querySelector(`.place-posts`);
  const vdom: VNode = createElement("div", { class: "posts" }, [
    createElement("div", { class: ELEMENTS_CLASS.POST.PROFILE.BLOCK }, [
      createElement("div", { style: "display: flex;" }, [
        window.location.pathname === "/profile"
          ? createElement("div", { class: "menu-icon" }, [
              createText("⋮"),
              createElement("div", { class: "dropdown-menu" }, [
                createElement("div", { class: "interaction-post" }, [
                  createElement("div", { class: "button-edit-post" }, [
                    createText("Редактировать"),
                  ]),
                ]),
                createElement("div", { class: "interaction-post" }, [
                  createElement("div", { class: "button-delete-post" }, [
                    createText("Удалить"),
                  ]),
                ]),
              ]),
            ])
          : createElement("div", {}, []),
        createElement("h4", { class: ELEMENTS_CLASS.POST.TITLE }, [
          createText(post.title),
        ]),
      ]),
      createElement("p", { class: ELEMENTS_CLASS.POST.CONTENT }, [
        createText(post.content),
      ]),
      createElement("div", { class: ELEMENTS_CLASS.POST.DATE }, [
        createText(post.createdAt),
      ]),
      createElement("div", { class: "interaction-section" }, [
        createElement("div", { class: ELEMENTS_CLASS.POST.LIKES.BLOCK }, [
          createElement(
            "div",
            { class: ELEMENTS_CLASS.POST.LIKES.ELEMENT },
            [],
          ),
          createElement("h3", { class: ELEMENTS_CLASS.POST.LIKES.AMOUNT }, [
            createText(post.likes),
          ]),
        ]),
      ]),
    ]),
  ]);
  // update(container, vdom)
  return vdom;
}

/**
 * Функция рендерит заголовок настроения пользователя.
 * @param {*} user Объект пользователя
 */
function renderVibe(user: any) {
  const vdom: VNode = createElement("h1", {}, [createText(user.status)]);
  return vdom;
}

/**
 * Функция рендерит статистику пользователя.
 * @param {*} user Объект пользователя
 * @param {*} posts Объект постов (не используется в функции)
 */
async function renderUserStats(user: any, payments: any) {
  const posts: any = await getUserPosts(window.location.pathname, 0, 300);
  const vdom: VNode = createElement("div", { class: "stats" }, [
    createElement("p", { style: "font-weight: bold; font-size: 26px" }, [
      createText(user.authorUsername),
    ]),
    createElement("p", { class: "amount-subs" }, []),
    createElement("p", {}, [
      createText(
        `Подписки ${user.subscriptions === null ? 0 : user.subscriptions}`,
      ),
    ]),
    window.location.pathname == "/profile"
      ? createElement("p", {}, [
          createText(
            `Выплаты ${payments.amount === null ? 0 : payments.amount}`,
          ),
        ])
      : createElement("div", {}, []),
    createElement("p", {}, [createText(`Подписчики ${user.followers}`)]),
    createElement("p", {}, [
      createText(`Посты ${calculateAmountPosts(posts)}`),
    ]),
  ]);
  return vdom;
}

export function renderEditPost(post: any) {
  const vdom: VNode = createElement("div", { class: "modal__editpost" }, [
    createElement("div", { class: "modal-header" }, [
      createElement("h2", {}, [createText("Редактирование")]),
    ]),
    createElement("div", { class: "form-group " }, [
      createElement("label", { class: "label-tip" }, [createText("Заголовок")]),
      createElement("textarea", { class: "input-group" }, [
        createText(post.title),
      ]),
    ]),
    createElement("div", { class: "form-group " }, [
      createElement("label", { class: "label-group" }, [
        createText("Содержание"),
      ]),
      createElement("textarea", { class: "textarea-group" }, [
        createText(post.content),
      ]),
      createElement("div", { class: "char-count" }, []),
    ]),
    createElement("div", { class: "form-actions " }, [
      createElement("button", { class: ELEMENTS_CLASS.CANCEL.COMBINE }, [
        createText("Закрыть"),
      ]),
      createElement("button", { class: ELEMENTS_CLASS.SAVE.COMBINE }, [
        createText("Сохранить"),
      ]),
    ]),
  ]);
  const container = document.querySelector(`.div-edit-posts`);
  update(container, vdom);
}
export function renderDeletePost(post: any) {
  const vdom: VNode = createElement("div", { class: "modal__deletepost" }, [
    createElement("div", { class: "modal-header" }, [
      createElement("h2", {}, [createText("Удаление поста")]),
    ]),
    createElement("div", { class: "form-group " }, [
      createElement("p", { class: "textarea-group-delete" }, [
        createText(`Вы действительно хотите удалить пост ${post.title}`),
      ]),
    ]),
    createElement("div", { class: "form-actions " }, [
      createElement("button", { class: ELEMENTS_CLASS.CANCEL.COMBINE }, [
        createText("Отменить"),
      ]),
      createElement("button", { class: ELEMENTS_CLASS.DELETE.COMBINE }, [
        createText("Подтвердить"),
      ]),
    ]),
  ]);
  const container = document.querySelector(`.div-delete-posts`);
  update(container, vdom);
}
export function renderTip() {
  const feedRegex = /^\/profile\/[0-9a-zA-Z-]+$/;
  if (!feedRegex.test(window.location.pathname)) {
    return createElement("div", {}, []);
  }

  const vdom: VNode = createElement("div", { class: "modal__tip" }, [
    createElement("div", { class: "modal-header" }, [
      createElement("h2", {}, [createText("Пожертвование")]),
    ]),
    createElement("div", { class: "form-group " }, [
      createElement("label", { class: "label-tip" }, [createText("Сумма")]),
      createElement("textarea", { class: "input-group" }, [createText("360")]),
      createElement("div", { class: "amount-count" }, [
        createText("Минимум 360 рублей"),
      ]),
    ]),
    createElement("div", { class: "form-group " }, [
      createElement("label", { class: "label-group" }, [
        createText("Содержание"),
      ]),
      createElement("textarea", { class: "textarea-group" }, []),
    ]),
    createElement("div", { class: "form-actions " }, [
      createElement("button", { class: ELEMENTS_CLASS.CANCEL.COMBINE }, [
        createText("Закрыть"),
      ]),
      createElement("button", { class: ELEMENTS_CLASS.SEND_TIP.COMBINE }, [
        createText("Отправить"),
      ]),
    ]),
  ]);
  const container = document.querySelector(`.div-send-tip`);
  console.log(container);
  console.log("vot");
  update(container, vdom);
}

export function renderCreatePost() {
  if (window.location.pathname !== "/profile") {
    return createElement("div", {}, []);
  }

  const vdom: VNode = createElement("div", { class: "modal__createpost" }, [
    createElement("div", { class: "modal-header" }, [
      createElement("h2", {}, [createText("Создание поста")]),
    ]),
    createElement("div", { class: "form-group " }, [
      createElement("label", { class: "label-tip" }, [createText("Заголовок")]),
      createElement("textarea", { class: "input-group" }, []),
    ]),
    createElement("div", { class: "form-group " }, [
      createElement("label", { class: "label-group" }, [
        createText("Содержание"),
      ]),
      createElement("textarea", { class: "textarea-group" }, []),
    ]),
    createElement("div", { class: "form-actions" }, [
      createElement("button", { class: ELEMENTS_CLASS.CANCEL.COMBINE }, [
        createText("Закрыть"),
      ]),
      createElement("button", { class: ELEMENTS_CLASS.SEND_TIP.COMBINE }, [
        createText("Создать"),
      ]),
    ]),
  ]);
  const container = document.querySelector(`.div-create-post`);
  update(container, vdom);
  // return vdom;
}
function renderAbout(authorData: any, isEdit = false, newValue?: any) {
  const container: any = document.querySelector(`.place-edit-info`);

  let vdom;

  if (isEdit) {
    // Режим редактирования
    vdom = createElement("div", { class: "about" }, [
      createElement("h2", {}, [createText("ОБО МНЕ")]),
      createElement(
        "input",
        {
          class: "about-input",
          value: newValue == undefined ? "ну ладно" : newValue,
        },
        [],
      ),
      createElement("div", { class: "interaction-place-info" }, [
        createElement("button", { class: "save-info-button" }, [
          createText("Сохранить"),
        ]),
        createElement("button", { class: "cancel-info-button" }, [
          createText("Отменить"),
        ]),
      ]),
    ]);
  } else {
    // Обычный режим
    vdom = createElement("div", { class: "about" }, [
      createElement("h2", {}, [createText("ОБО МНЕ")]),
      createElement(
        "input",
        {
          class: "about-input",
          value: newValue == undefined ? "ну ладно" : newValue,
          style: "display: none;", // Скрываем инпут в обычном режиме
        },
        [],
      ),
      createElement("p", { class: "about-profile" }, [
        createText(
          authorData.info == null
            ? newValue == undefined
              ? "Изменить статус..."
              : newValue
            : authorData.info,
        ),
      ]),
      window.location.pathname == "/profile"
        ? createElement("button", { class: "edit-info-button" }, [
            createText("Изменить"),
          ])
        : createElement("div", {}, []),
    ]);
  }

  update(container, vdom);

  return container;
}
async function renderDesktopProfileInfo(
  authorData: any,
  avatar: any,
  payments: any,
) {
  const vdom: VNode = createElement("div", { class: "left-column" }, [
    createElement(
      "img",
      {
        src: avatar,
        class: "profile-avatar",
      },
      [],
    ),
    ...(await renderUserInfo(authorData, payments)),
  ]);
  return vdom;
}
function renderDesktopProfileHeader(background: any) {
  const vdom: VNode = createElement("div", { class: "header-profile" }, [
    createElement("form", {}, [
      createElement(
        "label",
        {
          class: "image-upload-label",
          style: "display: none",
          type: "file",
          accept: "image/*",
          htmlFor: "image-upload",
        },
        [
          createElement("i", { class: "icon-edit-background" }, []),
          createText("  Выбрать обложку"),
        ],
      ),
      createElement(
        "input",
        {
          id: "image-upload",
          class: "image-upload-input",
          type: "file",
          accept: "image/*",
          style: "display: none;",
        },
        [],
      ),
      createElement("img", { class: "background-image", src: background }, []),
    ]),
  ]);

  return vdom;
}
async function mobileProfile(
  user: any,
  avatar: any,
  background: any,
  payments: any,
  posts: any[],
) {
  const vdom: VNode = createElement("div", { class: "mobile-profile" }, [
    createElement("div", { class: "profile-header-mobile" }, [
      createElement(
        "img",
        {
          class: "profile-avatar",
          src: avatar,
          height: "90",
          width: "90",
        },
        [createElement("h1", {}, [createText("")])],
      ),
      createElement(
        "input",
        {
          id: "image-upload-mobile",
          class: "image-upload-input-mobile",
          type: "file",
          accept: "image/*",
          style: "display: none;",
        },
        [],
      ),
      createElement(
        "img",
        { class: "background-image-mobile", src: background },
        [],
      ),
      window.location.pathname === "/profile"
        ? createElement(
            "button",
            {
              class: "change-cover-button-mobile",
            },
            [createText("  Выбрать обложку")],
          )
        : createElement("div", {}, []),
    ]),
    createElement("div", { class: "tabs-mobile" }, [
      createElement("div", { class: "about-mobile__button" }, [
        createText("ABOUT"),
      ]),
      createElement("div", { class: "posts-mobile__button" }, [
        createText("POSTS"),
      ]),
    ]),
    createElement("div", { class: "content-mobile" }, [
      ...(await renderUserInfo(user, payments)),
    ]),
  ]);
  const container = document.querySelector(`.div-mobile`);
  update(container, vdom);
}

/**
 * Функция рендерит информацию о пользователе.
 * @param {*} user Объект пользователя
 * @param {*} payments Объект выплат
 */
async function renderUserInfo(user: any, payments: any) {
  const vdom: VNode[] = [
    // createElement("div", { class: "stats" }, [
    await renderUserStats(user, payments),
    // ]),
    createElement("div", { class: "buttons-profile" }, [
      window.location.pathname == "/profile"
        ? createElement("button", { class: "create" }, [
            createElement("i", { class: "icon-sendtip" }, []),
            createText("Создать публикацию"),
          ])
        : createElement("div", {}, [
            createElement("button", { class: "follow" }, [
              createElement("i", { class: "icon-follow" }, []),
              createText("Подписаться"),
            ]),
            createElement("button", { class: "send-tip__button-new" }, [
              createElement("i", { class: "icon-sendtip" }, []),
              createText("Отправить пожертвование"),
            ]),
          ]),
    ]),
  ];
  return vdom;
}
export {
  renderUserPosts,
  renderVibe,
  renderUserStats,
  renderUserInfo,
  mobileProfile,
  renderDesktopProfileHeader,
  renderAbout,
  renderDesktopProfileInfo,
};
