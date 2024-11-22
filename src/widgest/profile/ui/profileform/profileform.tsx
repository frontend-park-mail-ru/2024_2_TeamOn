import * as VDom from "vdom";
import { renderDesktopProfileHeader } from "../../../../entities/profileDesktopHeader";
import { renderUserInfo } from "../../../../entities/profileInfo/ui/ui";
import { getCustomSubscription } from "../../../../features/getCustomSubs/getCustomSubs";
import { renderContainerAddCustomSubs } from "../../../../pages/profile/ui/profile";

function containerCustomSubscribe(subscription: any) {
  const flag =
    window.location.pathname === "/profile"
      ? "display: none"
      : "display: block;";
  return (
    <div class="subscription-level">
      <h3 class="title-level">{subscription.title}</h3>
      <p class="count-level">{subscription.cost} ₽ в месяц</p>
      <p class="content-level">{subscription.description}</p>
      <button class="button-buy-subs" style={flag}>
        Оформить
      </button>
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
            <div class="place-posts" style={isSubs}></div>
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

export { profileForm, containerCustomSubscribe };
