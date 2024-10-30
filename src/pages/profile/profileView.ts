import { ELEMENTS_CLASS } from "../../consts";
import { createElement, createText } from "../../lib/vdom/lib";
import { calculateAmountPosts } from "../../utils/calculateAmountPosts";
import { VNode } from "../../lib/vdom/src/source";

function renderUserPosts(post: any) {
  const container: VNode = createElement("div", { class: "posts" }, [
    createElement("div", { class: ELEMENTS_CLASS.POST.PROFILE.BLOCK }, [
      window.location.pathname === "/feed/profile"
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
  const container: VNode = createElement("div", { class: "modal__editpost" }, [
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
  return container;
}
export function renderDeletePost(post: any) {
  const container: VNode = createElement(
    "div",
    { class: "modal__deletepost" },
    [
      createElement("div", { class: "modal-header" }, [
        createElement("h2", {}, [createText("Удаление")]),
      ]),
      createElement("div", { class: "form-group " }, [
        createElement("div", { class: "input-group" }, [
          createText(post.title),
        ]),
      ]),
      createElement("div", { class: "form-group " }, [
        createElement("div", { class: "textarea-group" }, [
          createText(post.content),
        ]),
        createElement("div", { class: "char-count" }, []),
      ]),
      createElement("div", { class: "form-actions " }, [
        createElement("button", { class: ELEMENTS_CLASS.CANCEL.COMBINE }, [
          createText("Закрыть"),
        ]),
        createElement("button", { class: ELEMENTS_CLASS.DELETE.COMBINE }, [
          createText("Удалить"),
        ]),
      ]),
    ],
  );
  return container;
}
export function renderTip() {
  const feedRegex = /^\/profile\/\d+$/;
  if (!feedRegex.test(window.location.pathname)) {
    return createElement("div", {}, []);
  }

  const container: VNode = createElement("div", { class: "modal__tip" }, [
    createElement("div", { class: "modal-header" }, [
      createElement("h2", {}, [createText("Пожертвование")]),
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
      createElement("div", { class: "char-count" }, [createText("0/200")]),
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
  return container;
}
export function renderButtonCreatePost() {
  const container: VNode = createElement("div", { class: "create-posts" }, [
    createElement("div", { class: ELEMENTS_CLASS.CREATE.COMBINE }, [
      createText("Создать"),
    ]),
  ]);
  return window.location.pathname === "/feed/profile" ? container : 0;
}

export function renderCreatePost() {
  if (window.location.pathname !== "/feed/profile") {
    return createElement("div", {}, []);
  }

  const container: VNode = createElement(
    "div",
    { class: "modal__createpost" },
    [
      createElement("div", { class: "modal-header" }, [
        createElement("h2", {}, [createText("Создание поста")]),
      ]),
      createElement("div", { class: "form-group " }, [
        createElement("label", { class: "label-tip" }, [
          createText("Заголовок"),
        ]),
        createElement("textarea", { class: "input-group" }, []),
      ]),
      createElement("div", { class: "form-group " }, [
        createElement("label", { class: "label-group" }, [
          createText("Содержание"),
        ]),
        createElement("textarea", { class: "textarea-group" }, []),
        createElement("div", { class: "char-count" }, [createText("0/200")]),
      ]),
      createElement("div", { class: "form-actions " }, [
        createElement("button", { class: ELEMENTS_CLASS.CANCEL.COMBINE }, [
          createText("Закрыть"),
        ]),
        createElement("button", { class: ELEMENTS_CLASS.SEND_TIP.COMBINE }, [
          createText("Пост"),
        ]),
      ]),
    ],
  );
  return container;
}

/**
 * Функция рендерит информацию о пользователе.
 * @param {*} user Объект пользователя
 * @param {*} payments Объект выплат
 */
function renderUserInfo(user: any, payments: any, formProfile?: any) {
  const earnings: VNode =
    window.location.pathname === "/feed/profile"
      ? getEarnings(payments)
      : createElement("div", { class: "donate-container" }, [
          createElement("button", { class: ELEMENTS_CLASS.DONATE.COMBINE }, [
            createText("Пожертвовать"),
          ]),
        ]);

  const vdom = createElement("div", { class: ELEMENTS_CLASS.PROFILE.LEFT }, [
    createElement("div", { class: ELEMENTS_CLASS.PROFILE.LEFT_BAR }, [
      createElement("img", { class: ELEMENTS_CLASS.PROFILE.IMAGE_PROFILE }, []),
      createElement("div", { class: ELEMENTS_CLASS.PROFILE.INFO }, [
        createElement("h2", {}, [createText(user.username)]),
        createElement("p", {}, [createText(user.role)]),
        earnings,
      ]),
    ]),
  ]);

  return vdom;
}
export { renderUserPosts, renderVibe, renderUserStats, renderUserInfo };
