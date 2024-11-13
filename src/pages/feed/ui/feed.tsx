import { getAccount } from "../../../auth/fsdfeed";
import {
  containerPopularposts,
  containerRecentlyposts,
} from "../../../widgest/feed/index";
import * as VDom from "vdom";

export async function createAppVNode() {
  const userdata = await getAccount();
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      <div class="right-content">
        <div class="section-title">Популярное</div>
        {containerPopularposts()}
        <div class="section-title">Недавние</div>
        {containerRecentlyposts()}
      </div>
    </div>
  );
}

/**
 * Функция рендера сайдбара
 * @param userdata Информация о юзере
 * @returns
 */
export async function Sidebar(userdata: any) {
  sessionStorage.setItem("account", userdata.username);
  const role = userdata.role;
  const styleProfileIcon = role === "Reader" ? "display: none" : "";
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
      </div>
    </div>
  );
}
