import { Sidebar } from "../../feed/ui/view";
import { getPageAuthor, getUserPosts } from "..";

import * as VDom from "vdom";
import { createText } from "jsxteamon2/dist/jsxteamon";
/**
 * Рендер основного контента
 * @param authorData Данные об авторе
 * @param avatar Аватар
 * @param background Бекграунд
 * @param userdata Данные о пользователе
 * @param payments Выплаты
 * @returns
 */

export async function profileContent(
  userdata: any,
  authorData: any,
  avatar: any,
  background: any,
  payments: any,
) {
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      {await profileForm(authorData, avatar, background, payments)}
      <div class="div-create-post"></div>
      <div class="div-send-tip"></div>
      <div class="div-edit-posts"></div>
      <div class="div-delete-posts"></div>
    </div>
  );
}
/**
 * Рендер формы профиля
 * @param authorData Данные об авторе
 * @param avatar Аватар
 * @param background Бекграунд
 * @param payments Выплаты
 * @returns
 */
async function profileForm(
  authorData: any,
  avatar: any,
  background: any,
  payments: any,
) {
  const isSubs =
    window.location.pathname === "/profile"
      ? "display: block"
      : authorData.isSubscribe
        ? "display: block;"
        : "display: none";
  return (
    <div class="profile-form">
      <div class="div-mobile"></div>
      {renderDesktopProfileHeaderr(background)}
      <div class="container-profile">
        {await renderDesktopProfileInf(authorData, avatar, payments)}
        <div class="center-column-profile">
          <div class="place-edit-info"></div>
          <div class="feed-profile">
            <div class="nav-tabs-profile">
              <a class="active-profile active">Лента</a>
            </div>
            <div class="place-posts" style={isSubs}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
/**
 * Рендер информации о профиле для десктопа
 * @param authorData Информация об авторе
 * @param avatar Аватар
 * @param payments Выплаты
 * @returns
 */
async function renderDesktopProfileInf(
  authorData: any,
  avatar: any,
  payments: any,
) {
  return (
    <div class="left-column">
      <img class="profile-avatar" src={avatar}></img>
      {await renderUserInf(authorData, payments)}
    </div>
  );
}

/**
 * Рендер бекграунда профиля для десктопа
 * @param background Бекграунд
 * @returns
 */
function renderDesktopProfileHeaderr(background: any) {
  return (
    <div class="header-profile">
      <form>
        <label
          class="image-upload-label"
          style="display: none"
          type="file"
          accept="image/*"
          htmlFor="image-upload"
        >
          <i class="icon-edit-background"></i>
          Выбрать обложку
        </label>
        <input
          id="image-upload"
          class="image-upload-input"
          type="file"
          accept="image/*"
          style="display: none;"
        ></input>
        <img class="background-image" src={background}></img>
      </form>
    </div>
  );
}

/**
 * Рендер мобильного профиля
 * @param user Пользователь
 * @param avatar Аватар
 * @param background Бекграунд
 * @param payments Выплаты
 * @returns
 */
export async function mobilepr(
  user: any,
  avatar: any,
  background: any,
  payments: any,
) {
  const flag = window.location.pathname === "/profile" ? "" : "display: none;";
  return (
    <div class="mobile-profile">
      <div class="profile-header-mobile">
        <img class="profile-avatar" src={avatar} height="90" width="90"></img>
        <input
          id="image-upload-mobile"
          class="image-upload-input-mobile"
          type="file"
          accept="image/*"
          style="diplay: none;"
        ></input>
        <img class="background-image-mobile" src={background}></img>
        <button class="change-cover-button-mobile" style={flag}>
          {" "}
          Выбрать обложку{" "}
        </button>
      </div>
      <div class="tabs-mobile">
        <div class="about-mobile__button"> ПРОФИЛЬ </div>
        <div class="posts-mobile__button"> ЛЕНТА </div>
      </div>
      <div class="content-mobile">{await renderUserInf(user, payments)}</div>
    </div>
  );
}

/**
 * Функция рендерит информацию о пользователе
 * @param {*} user Объект пользователя
 * @param {*} payments Объект выплат
 */
async function renderUserInf(user: any, payments: any) {
  const authorData: any = await getPageAuthor(window.location.pathname);
  const isSubs: any = authorData.isSubscribe ? "Подписаны" : "Подписаться";
  const flag: any =
    window.location.pathname === "/profile"
      ? "display: block;"
      : "display: none;";
  const flagTwo: any =
    window.location.pathname === "/profile"
      ? "display: none;"
      : "display: block;";
  return (
    <div>
      {await renderUserSt(user, payments)}
      <div class="buttons-profile">
        <button class="create" style={flag}>
          <i class="icon-sendtip"></i>
          Создать публикацию
        </button>
        <button class="follow" style={flagTwo}>
          <i class="icon-follow"></i>
          {isSubs}
        </button>
        <button class="send-tip__button-new" style={flagTwo}>
          <i class="icon-sendtip"></i>
          Поблагодарить
        </button>
      </div>
    </div>
  );
}

/**
 * Функция рендерит статистику пользователя.
 * @param {*} user Объект пользователя
 * @param {*} posts Объект постов (не используется в функции)
 */
export async function renderUserSt(user: any, payments: any = null) {
  const posts: any = await getUserPosts(window.location.pathname, 0, 300);
  const flag: any =
    window.location.pathname === "/profile"
      ? "display: block;"
      : "display: none;";
  const amountPosts: any = posts.length;
  const subscriptions: any =
    user.subscriptions.length === null ? 0 : user.subscriptions.length;

  return (
    <div class="stats">
      <p style="font-weight: bold; font-size: 26px">{user.authorUsername}</p>
      <p class="amount-subs"></p>
      <p>Подписки {createText(subscriptions)}</p>
      <p>
        Подписчики {createText(user.followers === null ? 0 : user.followers)}
      </p>
      <p>Посты {createText(amountPosts)}</p>
    </div>
  );
}

/**
 * Рендер контейнера поста
 * @param post Пост
 * @returns
 */
export async function renderUserPost(post: any) {
  const flag: any =
    window.location.pathname === "/profile"
      ? "display: block;"
      : "display: none;";
  return (
    <div class="posts">
      <div class="post">
        <div style="display: flex;">
          <div class="menu-icon" style={flag}>
            ⋮
            <div class="dropdown-menu">
              <div class="interaction-post">
                <div class="button-edit-post">Редактировать</div>
              </div>
              <div class="interaction-post">
                <div class="button-delete-post">Удалить</div>
              </div>
            </div>
          </div>
          <h4 class="title">{createText(post.title)}</h4>
        </div>
        <p class="content">{createText(post.content)}</p>
        <div class="date">{createText(post.createdAt)}</div>
        <div class="interaction-section">
          <div class="likes-container">
            <div class="likes"></div>
            <h3 class="amount-likes">{createText(post.likes)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Рендер контейнера "О СЕБЕ"
 * @param authorData Информация об авторе
 * @param isEdit Флаг для перехода в режим редактирования
 * @param newValue Новое значение
 * @returns
 */
export function renderAbou(authorData: any, isEdit = false, newValue?: any) {
  const flag =
    window.location.pathname === "/profile"
      ? "display: block"
      : "display: none;";
  const editModeValue = (
    <div class="about">
      <h2>ОБО МНЕ</h2>
      <input
        class="about-input"
        value={newValue == undefined ? "Мой статус..." : newValue}
      ></input>
      <div class="interaction-place-info">
        <button class="save-info-button">Сохранить</button>
        <button class="cancel-info-button">Отменить</button>
      </div>
    </div>
  );
  const defaultModeValue = (
    <div class="about">
      <h2>ОБО МНЕ</h2>
      <input
        class="about-input"
        value={newValue == undefined ? "Мой статус..." : newValue}
        style="display: none;"
      ></input>
      <p class="about-profile">
        {createText(
          authorData.info == null
            ? newValue == undefined
              ? "Изменить статус..."
              : newValue
            : authorData.info,
        )}
      </p>
      <button class="edit-info-button" style={flag}>
        Изменить
      </button>
    </div>
  );
  return isEdit ? editModeValue : defaultModeValue;
}

export function renderEditPos(post: any) {
  return (
    <div class="modal__editpost">
      <div class="modal-header">
        <h2>Редактирование</h2>
      </div>
      <div class="form-group">
        <label class="label-tip">Заголовок</label>
        <textarea class="input-group">{post.title}</textarea>
      </div>
      <div class="form-group">
        <label class="label-group">Содержание</label>
        <textarea class="textarea-group">{post.content}</textarea>
        <div class="char-count"></div>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="save save__button save__button__effects">
          Сохранить
        </button>
      </div>
    </div>
  );
}

/**
 * Рендер удаления поста
 * @param post Пост
 */
export function renderDelPos(post: any) {
  return (
    <div class="modal__deletepost">
      <div class="modal-header">
        <h2>Удаление поста</h2>
      </div>
      <div class="form-group">
        <p class="textarea-group-delete">
          Вы действительно хотите удалить пост{post.title} ?
        </p>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="delete delete__button delete__button__effects">
          Удалить
        </button>
      </div>
    </div>
  );
}

/**
 * Функция рендера модального окна пожертвования
 * @returns
 */
export function renderTi() {
  const feedRegex = /^\/profile\/[0-9a-zA-Z-]+$/;
  if (!feedRegex.test(window.location.pathname)) {
    return <></>;
  }

  return (
    <div class="modal__tip">
      <div class="modal-header">
        <h2>Пожертвование</h2>
      </div>
      <div class="form-group">
        <label class="label-tip">Сумма</label>
        <textarea class="input-group">360</textarea>
        <div class="amount-count">Минимум 360 рублей</div>
      </div>
      <div class="form-group">
        <label class="label-group">Сообщение</label>
        <textarea class="textarea-group"></textarea>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="send-tip send-tip__button send-tip__button__effects">
          Отправить
        </button>
      </div>
    </div>
  );
}

/**
 * Рендер модального окна создания поста
 * @returns
 */
export function renderCreatePos() {
  if (window.location.pathname !== "/profile") {
    return <></>;
  }

  return (
    <div class="modal__createpost">
      <div class="modal-header">
        <h2>Создание поста</h2>
      </div>
      <div class="form-group">
        <label class="label-tip">Заголовок</label>
        <textarea class="input-group"></textarea>
      </div>
      <div class="form-group">
        <label class="label-group">Содержание</label>
        <textarea class="textarea-group"></textarea>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="send-tip send-tip__button send-tip__button__effects">
          Создать
        </button>
      </div>
    </div>
  );
}
