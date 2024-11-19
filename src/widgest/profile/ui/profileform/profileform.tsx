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
        <div class="right-column">
          <h2>Подписки</h2>
          <div class="subscription-levels">
            <div class="subscription-level">
              <h3 class="title-level">Соточка</h3>
              <p class="count-level">100 ₽ в месяц</p>
              <p class="content-level">
                Спасибо за вашу поддержку! Уровни подписки не будут отличаться
                по уникальному доступу к контенту, он здесь для всех один :)
              </p>
              <button class="button-buy-subs">Оформить</button>
            </div>
            <div class="subscription-level">
              <h3 class="title-level">Соточка</h3>
              <p class="count-level">100 ₽ в месяц</p>
              <p class="content-level">
                Спасибо за вашу поддержку! Уровни подписки не будут отличаться
                по уникальному доступу к контенту, он здесь для всех один :)
              </p>
              <button class="button-buy-subs">Оформить</button>
            </div>
            <div class="subscription-level">
              <h3 class="title-level">Соточка</h3>
              <p class="count-level">100 ₽ в месяц</p>
              <p class="content-level">
                Спасибо за вашу поддержку! Уровни подписки не будут отличаться
                по уникальному доступу к контенту, он здесь для всех один :)
              </p>
              <button class="button-buy-subs">Оформить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { profileForm };
