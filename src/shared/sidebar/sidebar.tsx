import * as VDom from "vdom";

/**
 * Функция рендера сайдбара
 * @param userdata Информация о юзере
 * @returns
 */
async function Sidebar(userdata: any) {
  sessionStorage.setItem("account", userdata.username);
  const role = userdata.role;
  const styleProfileIcon =
    role === "Reader" ? "display: none" : "display: flex;";
  return (
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
          <a class="referens profile" style={styleProfileIcon}>
            <i class="icon-profile"></i>
            Профиль
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
}

export { Sidebar };
