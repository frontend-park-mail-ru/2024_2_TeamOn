// import * as VDom from "vdom";
import { getAccount } from "./feedView";
import * as VDom from "vdom";
import { createText } from "jsxteamon2/dist/jsxteamon";

export async function createAppVNode() {
  const userdata = await getAccount();
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      <div class="right-content">
        <div class="section-title">Популярное</div>
        <div class="main-container-popular"></div>
        <div class="section-title">Недавние</div>
        <div class="main-container-recently"></div>
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
/**
 * Рендер контейнера поста
 * @param post Пост
 * @param mediaContent Медиа-контент у поста
 * @returns
 */
export async function Post() {
  return (
    <div>
      <div class="post-container">
        <div class="author-section">
          <img class="author-avatar avatar"></img>
          <div class="author-name"></div>
        </div>
        <div class="title"></div>
        <div class="content"></div>
        <div class="date"></div>
        <div class="iteraction-section">
          <div class="likes-container">
            <div class="likes"></div>
            <h3 class="amount-likes"></h3>
          </div>
        </div>
      </div>
    </div>
  );
}
