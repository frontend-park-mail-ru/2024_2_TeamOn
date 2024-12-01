import * as VDom from "vdom";
import { renderDesktopProfileHeader } from "../../../../entities/profileDesktopHeader";
import { renderUserInfo } from "../../../../entities/profileInfo/ui/ui";
import { getCustomSubscription } from "../../../../features/getCustomSubs/getCustomSubs";
import { renderContainerAddCustomSubs } from "../../../../pages/profile/ui/profile";

function containerCustomSubscribe(subscription: any, userdata: any = null) {
  const flag: string =
    window.location.pathname === "/profile"
      ? "display: none"
      : "display: block;";
  let isSubs: boolean = false;
  if (userdata) {
    isSubs = userdata.isSubscribe;
  }
  const text: any = isSubs ? "Уже подписаны" : "Подписаться";
  const styleSubs: any = isSubs ? "display: none" : "display: block";
  const disable: any = isSubs
    ? " pointer-events: none;  cursor: not-allowed;"
    : "";
  return (
    <div class="subscription-level">
      <h3 style={styleSubs} class="title-level">
        {subscription.title}
      </h3>
      <p style={styleSubs} class="count-level">
        {String(subscription.cost)} ₽ в месяц
      </p>
      <p style={styleSubs} class="content-level">
        {String(subscription.description)}
      </p>
      <button class="button-buy-subs" style={flag + disable}>
        {text}
      </button>
    </div>
  );
}
function containerNoneCustomSubcsribe() {
  return (
    <div class="subscription-level">
      <h3 class="title-level">У этого пользователя еще нет подписок</h3>
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
  return (
    <div class="profile-form">
      <div class="div-mobile"></div>
      {renderDesktopProfileHeader(background)}
      <div class="container-profile">
        <div class="left-column">
          <img class="profile-avatar" src={avatar}></img>
          {await renderUserInfo(authorData, payments)}
        </div>
        <div class="center-column-profile">
          <div class="place-edit-info"></div>
          <div class="feed-profile">
            <div class="nav-tabs-profile">
              <a class="active-profile active">Лента</a>
            </div>
            <div class="place-posts"></div>
          </div>
        </div>
        <div class="right-column">
          <h2>Подписки</h2>
          {renderContainerAddCustomSubs()}
          <div class="subscription-levels"></div>
        </div>
      </div>
    </div>
  );
}

export { profileForm, containerCustomSubscribe, containerNoneCustomSubcsribe };
