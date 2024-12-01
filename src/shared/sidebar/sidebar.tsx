import * as VDom from "vdom";
import { hasLogged } from "../utils/hasLogged";
import { getAccount } from "../../features/getAccount/getAccount";

/**
 * Функция рендера сайдбара
 * @param userdata Информация о юзере
 * @returns
 */
async function Sidebar() {
  let result: any;
  if (hasLogged()) {
    const userdata: any = await getAccount();

    sessionStorage.setItem("account", userdata.username);
    const role = userdata.role;
    const styleProfileIcon =
      role === "Reader" ? "display: none" : "display: flex;";
    const styleModerationIcon =
      role === "Reader" ? "display: none" : "display: flex;";
    result = (
      <div class="side">
        <div class="burger">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
        <div class="sidebar">
          <div class="nav-menu">
            <a class="referens">
              <i class="icon-home"></i>
              Главная
            </a>
            <a class="referens">
              <i class="icon-settings"></i>
              Настройки
            </a>
            <a class="referens">
              <i class="icon-moderation"></i>
              Модерация
            </a>
            <a class="referens profile" style={styleProfileIcon}>
              <i class="icon-profile"></i>
              Профиль
              <span style="display: none;" class="new-badge">
                НОВОЕ
              </span>
            </a>
          </div>
          <div class="logout">
            <div class="logout__button logout__button__effects">Выйти</div>
          </div>
          <div class="become-a-creator" style="display: none">
            <h4 class="notification-become">
              Присоединяйтесь к сообществу авторов!
            </h4>
            <button class="join-button">
              <i style="font-style: normal;"> Стать автором </i>
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    result = (
      <div class="side">
        <div class="burger">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
        <div class="sidebar">
          <div class="nav-menu">
            <a class="referens">
              <i class="icon-home"></i>
              Главная
            </a>
          </div>
          <div class="become-a-creator" style="display: none">
            <h4 class="notification-become">Присоединяйтесь к сообществу!</h4>
            <button class="join-button">
              <i style="font-style: normal;"> Войти </i>
            </button>
          </div>
        </div>
      </div>
    );
  }
  return result;
}

export { Sidebar };
