import * as VDom from "vdom";
import { renderDesktopProfileHeader } from "../../../../entities/profileDesktopHeader";
import { renderUserInfo } from "../../../../entities/profileInfo/ui/ui";
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
      </div>
    </div>
  );
}

export { profileForm };
