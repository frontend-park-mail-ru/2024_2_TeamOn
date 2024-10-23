import { ELEMENTS, ELEMENTS_CLASS, LINKS, LOCATIONS } from "../../consts";
import { fetchAjax } from "../../utils/fetchAjax";
import { removeItemLocalStorage } from "../../utils/storages";
import { route } from "../../utils/routing";
import { renderSidebar } from "../feed/feedView";
import {
  renderCreatePost,
  renderUserInfo,
  renderUserPosts,
  renderUserStats,
  renderVibe,
} from "./profileView";

/**
 * Получение текущего профиля через объект типа промис
 * @returns Информация о пользователе
 */
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.PROFILE.METHOD,
      LOCATIONS.PROFILE.HREF,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 401) {
          route(LINKS.LOGIN.HREF);
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}

/**
 * Получение запрошенного профиля через объект типа промис
 * @returns Информация о пользователе
 */
export function getUser() {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.PROFILE.METHOD,
      LOCATIONS.PROFILE.HREF,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 401) {
          route(LINKS.LOGIN.HREF);
        } else {
          reject(new Error("Ответ от фетча с ошибкой"));
        }
      },
    );
  });
}

/**
 * Функция рендерит кнопку выхода из системы.
 * @param {*} Item Ключ, по которому необходимо стереть локальные и сессионные данные
 * @returns
 */
export function renderLogoutButton(Item: any) {
  const logout = document.createElement(ELEMENTS.DIV);
  logout.classList.add("logout-button");
  const logoutLink = document.createElement(ELEMENTS.DIV);
  logoutLink.classList.add(ELEMENTS_CLASS.LOGOUT);
  logoutLink.textContent = "Выйти";
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    removeItemLocalStorage(Item);

    route(LINKS.HOME.HREF);
  });
  logout.appendChild(logoutLink);
  return logout;
}
/**
 * Асинхронная функция рендеринга профиля пользователя.
 * @returns созданный элемент профиля пользователя или 0,
 * если пользователь не найден
 */
export async function renderProfile() {
  try {
    var user: any = null;
    if (window.location.pathname == LINKS.PROFILE.HREF) {
      user = await getCurrentUser();
    } else {
      user = await getUser();
    }
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    // const doc: any = document.body;
    // doc.style.height = "100%";
    const container: any = document.createElement(ELEMENTS.DIV);
    container.classList.add("main-content");

    const formProfile = document.createElement(ELEMENTS.DIV);
    formProfile.classList.add(ELEMENTS_CLASS.FORM_PROFILE);

    const header = document.createElement(ELEMENTS.DIV);
    header.classList.add(ELEMENTS_CLASS.HEADER_PROFILE);

    header.appendChild(renderVibe(user));

    const profile = document.createElement(ELEMENTS.DIV);
    profile.classList.add(ELEMENTS_CLASS.PROFILE);

    profile.appendChild(renderUserInfo(user, null, formProfile));

    const right = document.createElement(ELEMENTS.DIV);
    right.classList.add(ELEMENTS_CLASS.RIGHT);

    right.appendChild(renderUserStats(user));

    right.appendChild(renderUserPosts(user));
    renderCreatePost(right);
    profile.appendChild(right);

    const sideBar: any = renderSidebar();

    formProfile.appendChild(header);
    formProfile.appendChild(profile);
    console.log(formProfile);
    container.appendChild(formProfile);
    container.appendChild(sideBar);
    return container;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}
