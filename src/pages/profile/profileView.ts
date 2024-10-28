import { ELEMENTS, ELEMENTS_CLASS } from "../../consts";
import { pageContainer } from "../../index";
import { createElementJSX } from "../../lib/jsx/lib";
import { createElement, createText, render } from "../../lib/vdom/lib";
import { Virtual } from "../../index";
import { calculateAmountPosts } from "../../utils/calculateAmountPosts";
import { VNode } from "../../lib/vdom/src/source";

function renderUserPosts(user: any) {
  const container = document.createElement("div");
  container.className = "posts";

  const postBlock = document.createElement("div");
  postBlock.className = ELEMENTS_CLASS.POST.PROFILE.BLOCK;

  const title = document.createElement("h4");
  title.className = ELEMENTS_CLASS.POST.TITLE;
  title.textContent = user.posts_title;
  postBlock.appendChild(title);

  const content = document.createElement("p");
  content.className = ELEMENTS_CLASS.POST.CONTENT;
  content.textContent = user.posts_content;
  postBlock.appendChild(content);

  const date = document.createElement("div");
  date.className = ELEMENTS_CLASS.POST.DATE;
  date.textContent = user.posts_date;
  postBlock.appendChild(date);
  container.appendChild(postBlock);

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
  const container = document.createElement("div");
  container.className = ELEMENTS_CLASS.PROFILE.EARNINGS;
  const header = document.createElement("h3");
  header.textContent = "Выплаты";
  container.appendChild(header);

  const subheader = document.createElement("h4");
  subheader.textContent = "За сегодня вы заработали:";
  container.appendChild(subheader);

  const paymentParagraph = document.createElement("p");
  paymentParagraph.textContent = payments ? `${payments.amount}` : `0.0 ₽`;
  container.appendChild(paymentParagraph);

  return container;
}

export function renderTip() {
  const container = document.createElement("div");
  container.className = "modal";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  const headerTitle = document.createElement("h2");
  headerTitle.textContent = "Пожертвование";
  modalHeader.appendChild(headerTitle);

  const formGroup1 = document.createElement("div");
  formGroup1.className = "form-group";
  const labelAmount = document.createElement("label");
  labelAmount.className = "label-tip";
  labelAmount.textContent = "Сумма";
  const inputAmount = document.createElement("input");
  inputAmount.className = "input-group";
  inputAmount.id = "tip-amount";
  inputAmount.type = "text";
  inputAmount.value = "10";
  const minTip = document.createElement("div");
  minTip.className = "min-tip";
  minTip.textContent = "Минимальная сумма 10 ₽";
  formGroup1.append(labelAmount, inputAmount, minTip);

  const formGroup2 = document.createElement("div");
  formGroup2.className = "form-group";
  const labelMessage = document.createElement("label");
  labelMessage.className = "label-group";
  labelMessage.textContent = "Сообщение";
  const textareaMessage = document.createElement("textarea");
  textareaMessage.className = "textarea-group";
  textareaMessage.id = "message";
  textareaMessage.placeholder = "Ваше сообщение";
  const charCount = document.createElement("div");
  charCount.className = "char-count";
  charCount.textContent = "0/200";
  formGroup2.append(labelMessage, textareaMessage, charCount);

  const formActions = document.createElement("div");
  formActions.className = "form-actions";
  const buttonCancel = document.createElement("button");
  buttonCancel.className = ELEMENTS_CLASS.CANCEL.COMBINE; // Убедитесь, что ELEMENTS_CLASS определен
  buttonCancel.textContent = "Cancel";
  const buttonSend = document.createElement("button");
  buttonSend.className = ELEMENTS_CLASS.SEND_TIP.COMBINE; // Убедитесь, что ELEMENTS_CLASS определен
  buttonSend.textContent = "Send";
  formActions.append(buttonCancel, buttonSend);

  // Собираем все элементы в контейнер
  container.append(modalHeader, formGroup1, formGroup2, formActions);

  return container;
}
export function renderButtonCreatePost(right: any) {
  const container = document.createElement("div");
  container.className = "create-posts";

  const createButton = document.createElement("a");
  createButton.className = ELEMENTS_CLASS.CREATE.COMBINE;
  createButton.textContent = "Создать";
  container.appendChild(createButton);

  right.appendChild(container);
  return createButton;
}

export function renderCreatePost(right: any) {
  if (window.location.pathname !== "/feed/profile") {
    return 0;
  }

  const btn = renderButtonCreatePost(right);
  const container = document.createElement("div");
  container.className = "modal";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  const headerTitle = document.createElement("h2");
  headerTitle.textContent = "Пожертвование";
  modalHeader.appendChild(headerTitle);

  const formGroup1 = document.createElement("div");
  formGroup1.className = "form-group";
  const labelTitle = document.createElement("label");
  labelTitle.className = "label-tip";
  labelTitle.textContent = "Заголовок";
  const inputTitle = document.createElement("input");
  inputTitle.className = "input-group";
  formGroup1.append(labelTitle, inputTitle);

  const formGroup2 = document.createElement("div");
  formGroup2.className = "form-group";
  const labelContent = document.createElement("label");
  labelContent.className = "label-group";
  labelContent.textContent = "Содержание";
  const textareaContent = document.createElement("textarea");
  textareaContent.className = "textarea-group";
  const charCount = document.createElement("div");
  charCount.className = "char-count";
  charCount.textContent = "0/200";
  formGroup2.append(labelContent, textareaContent, charCount);

  const formActions = document.createElement("div");
  formActions.className = "form-actions";
  const buttonCancel = document.createElement("button");
  buttonCancel.className = ELEMENTS_CLASS.CANCEL.COMBINE;
  buttonCancel.textContent = "Cancel";
  const buttonPost = document.createElement("button");
  buttonPost.className = ELEMENTS_CLASS.SEND_TIP.COMBINE;
  buttonPost.textContent = "Post";
  formActions.append(buttonCancel, buttonPost);

  container.append(modalHeader, formGroup1, formGroup2, formActions);

  inputTitle.id = "message";
  inputTitle.placeholder = "Введите заголовок";
  textareaContent.id = "message";
  textareaContent.placeholder = "Введите содержание";

  const root = pageContainer;

  document.body.appendChild(container);
  btn.addEventListener("click", () => {
    container.style.display = "block";
    root.classList.add("blur");
  });
  buttonCancel.addEventListener("click", () => {
    container.style.display = "none";
    root.classList.remove("blur");
  });

  return container;
}

/**
 * Функция рендерит информацию о пользователе.
 * @param {*} user Объект пользователя
 * @param {*} payments Объект выплат
 */
function renderUserInfo(user: any, payments: any, formProfile?: any) {
  const vdom = createElement("div", { class: ELEMENTS_CLASS.PROFILE.LEFT }, [
    createElement("div", { class: ELEMENTS_CLASS.PROFILE.LEFT_BAR }, [
      createElement("img", { class: ELEMENTS_CLASS.PROFILE.IMAGE_PROFILE }, []),
      createElement("div", { class: ELEMENTS_CLASS.PROFILE.INFO }, [
        createElement("h2", {}, [createText(user.username)]),
        createElement("p", {}, [createText(user.role)]),
      ]),
    ]),
  ]);

  return vdom;
}
export { renderUserPosts, renderVibe, renderUserStats, renderUserInfo };
