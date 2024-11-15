import * as VDom from "vdom"
import { getPageAuthor } from "../../../features/getpageauthor/getpageauthor";
import { getUserPosts } from "../../../features/getuserposts/getUserPosts";
import { createText } from "../../../../lib/vdom/lib";
/**
 * Функция рендерит информацию о пользователе
 * @param {*} user Объект пользователя
 * @param {*} payments Объект выплат
 */
async function renderUserInfo(user: any, payments: any) {
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
        {await renderUserStats(user, payments)}
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
async function renderUserStats(user: any, payments: any = null) {
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
        <p>Подписки {subscriptions}</p>
        <p>
          Подписчики {createText(user.followers === null ? 0 : user.followers)}
        </p>
        <p>Посты {createText(amountPosts)}</p>
      </div>
    );
  }

  export { renderUserInfo, renderUserStats }