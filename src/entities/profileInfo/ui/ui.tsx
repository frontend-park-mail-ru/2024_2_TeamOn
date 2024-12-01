import * as VDom from "vdom";
import { getPageAuthor } from "../../../features/getpageauthor/getpageauthor";
import { getUserPosts } from "../../../features/getuserposts/getUserPosts";
import { createText } from "../../../../lib/vdom/lib";
import { renderSearchbar } from "../../../entities/searchbar";
/**
 * Функция рендерит информацию о пользователе
 * @param {*} user Объект пользователя
 * @param {*} payments Объект выплат
 */
async function renderUserInfo(user: any, payments: any) {
  const flag: string =
    window.location.pathname === "/profile"
      ? "display: block;"
      : "display: none;";
  const flagTwo: string =
    window.location.pathname === "/profile"
      ? "display: none;"
      : "display: block;";
  return (
    <div>
      {await renderUserStats(user, payments)}
      <div class="buttons-profile">
        <button class="create" style={flag}>
          <i class="icon-sendtip"></i>
          Создать публикацию
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
async function renderUserStats(user: any, payments: any = null) {
  const posts: any = await getUserPosts(window.location.pathname, 0, 300);
  const flag: string =
    window.location.pathname === "/profile"
      ? "display: block;"
      : "display: none;";
  const amountPosts: string = String(posts.length);
  const subscriptions: string = String(
    user.subscriptions.length === null ? 0 : user.subscriptions.length,
  );
  const followers: string = String(
    user.followers === null ? 0 : user.followers,
  );
  const paymentsCount: string = String(payments.amount);
  return (
    <div class="stats">
      <p style="font-weight: bold; font-size: 26px">{user.authorUsername}</p>
      <div class="container-subscription">
        <p
          class="amount-subscriptions"
          style="font-weight: bold; cursor: pointer;"
        >
          {subscriptions}
        </p>
        <p class="subscriptions" style="color: #7c7c7c">
          Подписки
        </p>
      </div>
      <p>Подписчики {followers}</p>
      <p>Посты {amountPosts}</p>
      <p style={flag}>Выплаты {paymentsCount}</p>
    </div>
  );
}

function renderUserSubscriptins() {
  return (
    <div class="modal__subscriptions">
      <div class="modal-content-subcriptions">
        <span class="close__button close__hover">&times;</span>
        <h2>Подписки</h2>
        {renderSearchbar()}
        <div class="results-subscriptions"></div>
      </div>
    </div>
  );
}

export { renderUserInfo, renderUserStats, renderUserSubscriptins };
