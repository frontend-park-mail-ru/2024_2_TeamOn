import { ELEMENTS, ELEMENTS_CLASS } from "../../consts";
import { pageContainer } from "../../index";

function renderUserPosts(user: any) {
  const postsContainer = document.createElement(ELEMENTS.DIV);
  postsContainer.classList.add("posts");
  const postDiv = document.createElement(ELEMENTS.DIV);
  postDiv.classList.add(ELEMENTS_CLASS.POST);

  const postTitle = document.createElement(ELEMENTS.H4);
  postTitle.textContent = user.posts_title;
  postDiv.appendChild(postTitle);

  const postContent = document.createElement(ELEMENTS.P);
  postContent.textContent = user.posts_content;
  postDiv.appendChild(postContent);

  const postDate = document.createElement(ELEMENTS.DIV);
  postDate.classList.add(ELEMENTS_CLASS.DATE);
  postDate.textContent = user.posts_date;
  postDiv.appendChild(postDate);

  postsContainer.appendChild(postDiv);

  return postsContainer;
}

/**
 * Функция рендерит заголовок настроения пользователя.
 * @param {*} user Объект пользователя
 */
function renderVibe(user: any) {
  const title = document.createElement(ELEMENTS.H1);
  const me = document.createElement(ELEMENTS.H4);
  me.textContent = `ОБО МНЕ`;
  title.textContent = `${user.status}`;
  me.appendChild(title);
  return me;
}

/**
 * Функция рендерит статистику пользователя.
 * @param {*} user Объект пользователя
 * @param {*} posts Объект постов (не используется в функции)
 */
function renderUserStats(user: any, posts = null) {
  const stats = document.createElement(ELEMENTS.DIV);
  stats.classList.add(ELEMENTS_CLASS.STATS);

  const statsData = [
    `посты: ${user.posts_amount}`,
    `подписчики: ${user.subscriptions}`,
    `подписки: ${user.followers}`,
  ];

  statsData.forEach((statText) => {
    const stat = document.createElement(ELEMENTS.DIV);
    stat.textContent = statText;
    stats.appendChild(stat);
  });
  return stats;
}

function getEarnings(payments: any) {
  const earnings = document.createElement(ELEMENTS.DIV);
  earnings.classList.add(ELEMENTS_CLASS.EARNINGS);

  const earningsTitle = document.createElement(ELEMENTS.H3);
  earningsTitle.textContent = "Выплаты";
  earnings.appendChild(earningsTitle);

  const earningsToday = document.createElement(ELEMENTS.H4);
  earningsToday.textContent = "За сегодня вы заработали:";
  earnings.appendChild(earningsToday);

  const amount = document.createElement(ELEMENTS.P);
  if (!payments) {
    amount.textContent = `0.0 ₽`;
  } else {
    amount.textContent = `${payments.amount}`;
  }
  earnings.appendChild(amount);
  return earnings;
}
function renderTip() {
  // Создаем основной элемент модального окна
  const modal = document.createElement("div");
  modal.className = "modal";

  // Создаем заголовок модального окна
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  const h2 = document.createElement("h2");
  h2.textContent = "Пожертвование";

  // Добавляем заголовок в модальное окно
  modalHeader.appendChild(h2);
  modal.appendChild(modalHeader);

  // Создаем группу для ввода суммы чаевых
  const tipGroup = document.createElement("div");
  tipGroup.className = "form-group";

  const tipLabel = document.createElement("label");
  tipLabel.setAttribute("for", "tip-amount");
  tipLabel.textContent = "Сумма";

  const tipInput = document.createElement("input");
  tipInput.id = "tip-amount";
  tipInput.type = "text";
  tipInput.value = "10";

  const minTip = document.createElement("div");
  minTip.className = "min-tip";
  minTip.textContent = "Минимальная сумма 10 ₽";

  // Добавляем элементы в группу для ввода суммы чаевых
  tipGroup.appendChild(tipLabel);
  tipGroup.appendChild(tipInput);
  tipGroup.appendChild(minTip);
  modal.appendChild(tipGroup);

  // Создаем группу для ввода сообщения
  const messageGroup = document.createElement("div");
  messageGroup.className = "form-group";

  const messageLabel = document.createElement("label");
  messageLabel.setAttribute("for", "message");
  messageLabel.textContent = "Сообщение";

  const optionalSpan = document.createElement("span");
  optionalSpan.className = "optional";
  optionalSpan.textContent = "Optional";
  messageLabel.appendChild(optionalSpan);

  const messageTextarea = document.createElement("textarea");
  messageTextarea.id = "message";
  messageTextarea.placeholder = "Ваше сообщение";

  const charCount = document.createElement("div");
  charCount.className = "char-count";
  charCount.textContent = "0/200";

  // Добавляем элементы в группу для ввода сообщения
  messageGroup.appendChild(messageLabel);
  messageGroup.appendChild(messageTextarea);
  messageGroup.appendChild(charCount);
  modal.appendChild(messageGroup);

  // Создаем группу для кнопок действий
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "form-actions";

  const sendButton = document.createElement("button");
  sendButton.className = "send-tip";
  sendButton.textContent = "SEND";

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel";
  cancelButton.textContent = "CANCEL";

  // Добавляем кнопки в группу действий
  actionsDiv.appendChild(sendButton);
  actionsDiv.appendChild(cancelButton);
  modal.appendChild(actionsDiv);
  return modal;
}
function renderButtonCreatePost(right: any) {
  const containerCreatePosts: any = document.createElement(ELEMENTS.DIV);
  containerCreatePosts.classList.add("create-posts");
  const createButton: any = document.createElement(ELEMENTS.A);
  createButton.classList.add("create-btn");
  createButton.textContent = "Создать";
  containerCreatePosts.appendChild(createButton);

  right.appendChild(containerCreatePosts);
  return createButton;
}
export function renderCreatePost(right: any) {
  if (window.location.pathname !== "/feed/profile") {
    return 0;
  }
  const btn: any = renderButtonCreatePost(right);
  // Создаем основной элемент модального окна
  const modal = document.createElement("div");
  modal.className = "modal";

  // Создаем заголовок модального окна
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  const h2 = document.createElement("h2");
  h2.textContent = "Создание поста";

  // Добавляем заголовок в модальное окно
  modalHeader.appendChild(h2);
  modal.appendChild(modalHeader);

  // Создаем группу для ввода суммы чаевых
  const tipGroup = document.createElement("div");
  tipGroup.className = "form-group";

  const tipLabel = document.createElement("label");
  tipLabel.setAttribute("for", "tip-amount");
  tipLabel.textContent = "Заголовок";

  const messageTitlearea = document.createElement("input");
  messageTitlearea.id = "message";
  messageTitlearea.placeholder = "Введите заголовок";

  tipGroup.appendChild(tipLabel);
  tipGroup.appendChild(messageTitlearea);
  modal.appendChild(tipGroup);

  const messageGroup = document.createElement("div");
  messageGroup.className = "form-group";

  const messageLabel = document.createElement("label");
  messageLabel.setAttribute("for", "message");
  messageLabel.textContent = "Содержание";

  const optionalSpan = document.createElement("span");
  optionalSpan.className = "optional";
  optionalSpan.textContent = "Optional";
  messageLabel.appendChild(optionalSpan);

  const messageTextarea = document.createElement("textarea");
  messageTextarea.id = "message";
  messageTextarea.placeholder = "Введите содержание";

  const charCount = document.createElement("div");
  charCount.className = "char-count";
  charCount.textContent = "0/200";

  messageGroup.appendChild(messageLabel);
  messageGroup.appendChild(messageTextarea);
  messageGroup.appendChild(charCount);
  modal.appendChild(messageGroup);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "form-actions";

  const sendButton = document.createElement("button");
  sendButton.className = "send-tip";
  sendButton.textContent = "Создать";

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel";
  cancelButton.textContent = "Закрыть";

  actionsDiv.appendChild(sendButton);
  actionsDiv.appendChild(cancelButton);
  modal.appendChild(actionsDiv);

  const root: any = pageContainer;

  document.body.appendChild(modal);
  const cancel: any = modal.querySelector(".cancel");
  btn.addEventListener("click", () => {
    modal.style.display = "block";
    root.classList.add("blur");
  });
  cancel.addEventListener("click", () => {
    modal.style.display = "none";
    root.classList.remove("blur");
  });

  return modal;
}
/**
 * Функция рендерит информацию о пользователе.
 * @param {*} user Объект пользователя
 * @param {*} payments Объект выплат
 */
function renderUserInfo(user: any, payments: any, formProfile?: any) {
  const left = document.createElement(ELEMENTS.DIV);
  left.classList.add(ELEMENTS_CLASS.LEFT);

  const leftbar = document.createElement(ELEMENTS.DIV);
  leftbar.classList.add(ELEMENTS_CLASS.LEFT_BAR);

  const profileImg = document.createElement(ELEMENTS.IMG);
  profileImg.classList.add(ELEMENTS_CLASS.IMAGE_PROFILE);
  leftbar.appendChild(profileImg);

  const info = document.createElement(ELEMENTS.DIV);
  info.classList.add(ELEMENTS_CLASS.INFO);

  const name = document.createElement(ELEMENTS.H2);
  name.textContent = `${user.username}`;
  info.appendChild(name);

  const desc = document.createElement(ELEMENTS.P);
  desc.textContent = `${user.role}`;
  info.appendChild(desc);

  leftbar.appendChild(info);
  if (window.location.pathname == "/feed/profile") {
    const earnings: any = getEarnings(payments);
    leftbar.appendChild(earnings);
  } else {
    const donateContainer: any = document.createElement("div");
    donateContainer.className = "donate-container";
    const donate: any = document.createElement("button");
    donate.textContent = "Пожертвовать";
    donate.className = "donate-btn";
    donateContainer.appendChild(donate);
    leftbar.appendChild(donateContainer);
    const modal: any = renderTip();
    const root: any = pageContainer;
    document.body.appendChild(modal);
    const cancel: any = modal.querySelector(".cancel");
    // Когда пользователь нажимает на кнопку, открываем модальное окно
    donate.addEventListener("click", () => {
      modal.style.display = "block";
      root.classList.add("blur");
    });
    cancel.addEventListener("click", () => {
      modal.style.display = "none";
      root.classList.remove("blur");
    });
  }
  left.appendChild(leftbar);
  return left;
}
export { renderUserPosts, renderVibe, renderUserStats, renderUserInfo };
