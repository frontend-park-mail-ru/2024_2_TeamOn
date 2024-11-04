import { ELEMENTS_CLASS } from "../../consts";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { calculateAmountPosts } from "../../utils/calculateAmountPosts";
import { VNode } from "../../lib/vdom/src/source";

function renderUserPosts(post: any) {
  const container: VNode = createElement("div", { class: "posts" }, [
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
    ]),
  ]);
  return container;
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
function renderUserStats(user: any, posts: any[]) {
  const statsData: string[] = [
    `посты: ${calculateAmountPosts(posts)}`,
    `подписчики: ${user.subscriptions}`,
    `подписки: ${user.followers}`,
  ];

  const vdom: VNode = createElement(
    "div",
    { class: ELEMENTS_CLASS.PROFILE.STATS },
    [
      createElement("div", {}, [createText(statsData[0])]),
      createElement("div", {}, [createText(statsData[1])]),
      createElement("div", {}, [createText(statsData[2])]),
    ],
  );
  return vdom;
}
export function getEarnings(payments: any) {
  const vdom: VNode = createElement(
    "div",
    { class: ELEMENTS_CLASS.PROFILE.EARNINGS },
    [
      createElement("h3", {}, [createText("Выплаты")]),
      createElement("h4", {}, [createText("За сегодня вы заработали")]),
      createElement("p", {}, [
        createText(payments ? `${payments.amount}` : `0.0 ₽`),
      ]),
    ],
  );
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
      createElement("textarea", { class: "input-group" }, [createText("10")]),
      createElement("div", { class: "amount-count" }, [
        createText("Минимум 10 рублей"),
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
function renderAbout() {
  const vdom = createElement("div", { class: "about" }, [
    createElement("h2", {}, [createText("ОБО МНЕ")]),
    createElement("p", { class: "about-profile" }, [
      createText("Это информация об авторе"),
    ]),
  ]);
  return vdom;
}
function renderDesktopProfileInfo(authorData: any, avatar: any) {
  const vdom: VNode = createElement("div", { class: "left-column" }, [
    createElement(
      "img",
      {
        src: avatar,
        class: "profile-avatar",
      },
      [],
    ),
    ...renderUserInfo(authorData),
  ]);
  return vdom;
}
function renderDesktopProfileHeader() {
  const vdom: VNode = createElement("div", { class: "header-profile" }, [
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
    createElement("img", { class: "background-image" }, []),
  ]);

  return vdom;
}
function mobileProfile(user: any) {
  const vdom: VNode = createElement("div", { class: "mobile-profile" }, [
    createElement("div", { class: "profile-header-mobile" }, [
      createElement(
        "img",
        {
          class: "profile-avatar",
          src: "https://storage.googleapis.com/a1aa/image/T5eRp2ABc9QWfkBRqFUjCIhfXbZ3lAeBU3pxRhWfsdwsSDmdC.jpg",
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
      createElement("img", { class: "background-image-mobile" }, []),
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
      ...renderUserInfo(user),
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
function renderUserInfo(user: any) {
  const vdom: VNode[] = [
    createElement("div", { class: "stats" }, [
      createElement("p", {}, [createText(user.authorUsername)]),
      createElement("p", { class: "amount-subs" }, []),
      createElement("p", {}, [createText("Подписчики")]),
    ]),
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
