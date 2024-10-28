// import { ELEMENTS, ELEMENTS_CLASS, LINKS, LOCATIONS } from "../../consts";
// import { fetchAjax } from "../../utils/fetchAjax";
// import { removeItemLocalStorage } from "../../utils/storages";
// import { route } from "../../utils/routing";
// import { renderSidebar } from "../feed/feedView";
// import {
//   getEarnings,
//   renderCreatePost,
//   renderTip,
//   renderUserInfo,
//   renderUserPosts,
//   renderUserStats,
//   renderVibe,
// } from "./profileView";
// import { VNode } from "../../lib/vdom/src/source";
// import { createElement, createText, update } from "../../lib/vdom/lib";
// import { pageContainer } from "../../index";
// import { customizeSidebar } from "../feed/feed";
// import { findUsername } from "../../utils/hasLogged";

// /**
//  * Получение текущего профиля через объект типа промис
//  * @returns Информация о пользователе
//  */
// export function getCurrentUser(link: string) {
//   return new Promise((resolve, reject) => {
//     fetchAjax(
//       link == LINKS.PROFILE.HREF
//         ? LOCATIONS.PROFILE.METHOD
//         : LOCATIONS.OTHER_PAGE.METHOD,
//       link == LINKS.PROFILE.HREF
//         ? LOCATIONS.PROFILE.HREF
//         : LOCATIONS.OTHER_PAGE.HREF,
//       null,
//       (response) => {
//         if (response.ok) {
//           response.json().then((data) => {
//             resolve(data);
//           });
//         } else if (response.status === 401) {
//           route(LINKS.LOGIN.HREF);
//         } else {
//           reject(new Error("Ответ от фетча с ошибкой"));
//         }
//       },
//     );
//   });
// }

// /**
//  * Функция рендерит кнопку выхода из системы.
//  * @param {*} Item Ключ, по которому необходимо стереть локальные и сессионные данные
//  * @returns
//  */
// export function renderLogoutButton(Item: any) {
//   const logout = document.createElement(ELEMENTS.DIV);
//   logout.className = ELEMENTS_CLASS.LOGOUT.BLOCK;
//   const logoutLink = document.createElement(ELEMENTS.DIV);
//   logoutLink.className = ELEMENTS_CLASS.LOGOUT.COMBINE;
//   logoutLink.textContent = "Выйти";
//   logoutLink.addEventListener("click", (event) => {
//     event.preventDefault();
//     removeItemLocalStorage(Item);
//     route(LINKS.HOME.HREF);
//   });
//   logout.appendChild(logoutLink);
//   return logout;
// }
// function customizeInfo(container: any, payments: any){
//  const leftbar: any = container.querySelector(
//     `.${ELEMENTS_CLASS.PROFILE.LEFT_BAR}`,
//   );

//   if (window.location.pathname == "/feed/profile") {
//     const earnings: any = getEarnings(payments);
//      leftbar.appendChild(earnings);
//     return earnings;
//   }
//   const vdomDonate: VNode = createElement("div", {class: "donate-container"}, [
//     createElement("button", { class: ELEMENTS_CLASS.DONATE.COMBINE }, [
//       createText("Пожертвовать"),
//     ])
//   ]);
//   const containerDonate: any = update(document.createElement("div"), vdomDonate)

//   leftbar.appendChild(containerDonate);
//   const modal: any = renderTip();
//   const root: any = pageContainer;
//   document.body.appendChild(modal);
//   const cancel: any = modal.querySelector(`.${ELEMENTS_CLASS.CANCEL.BLOCK}`);

//   // Когда пользователь нажимает на кнопку, открываем модальное окно
//   containerDonate.addEventListener("click", () => {
//     modal.style.display = "block";
//     root.classList.add("blur");
//   });
//   cancel.addEventListener("click", () => {
//     modal.style.display = "none";
//     root.classList.remove("blur");
//   });

// }
// /**
//  * Асинхронная функция рендеринга профиля пользователя.
//  * @returns созданный элемент профиля пользователя или 0,
//  * если пользователь не найден
//  */
// export async function renderProfile() {
//   try {
//     var user: any = null;
//     user = await getCurrentUser(window.location.pathname);

//     if (!user) {
//       throw new Error("Пользователь не найден");
//     }
//     const doc: any = document.body;
//     doc.style.height = "100%";

//     const vdom: VNode = createElement("div", { class: "main-content" }, [
//       createElement("div", { class: ELEMENTS_CLASS.PROFILE.FORM }, [
//         createElement("div", { class: ELEMENTS_CLASS.PROFILE.HEADER }, [
//           renderVibe(user)
//         ]),

//       createElement("div", { class: ELEMENTS_CLASS.PROFILE.BLOCK }, [
//         renderUserInfo(user, null),
//         createElement("div", { class: ELEMENTS_CLASS.PROFILE.RIGHT }, [
//           renderUserStats(user, user)
//         ])
//       ])
//     ]),
//     createElement("div", { class: ELEMENTS_CLASS.SIDEBAR.BLOCK }, [
//       createElement("div", { class: ELEMENTS_CLASS.BURGER.BLOCK }, [
//         createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
//         createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
//         createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
//       ]),
//       createElement("div", { class: ELEMENTS_CLASS.SIDEBAR.ELEMENT }, [])
//     ]),
//     ])
//     const container = update(pageContainer, vdom);
//     const sidebar: any = container.querySelector(`.${ELEMENTS_CLASS.SIDEBAR.ELEMENT}`);
//     sidebar.appendChild(customizeSidebar(sidebar))
//     const userF: any = findUsername();

//     if (userF) {
//       sidebar.appendChild(renderLogoutButton(userF));
//     } else {
//       route(LINKS.HOME.HREF);
//     }

//     customizeInfo(container, user.payments)

//     const post: any = container.querySelector(`.${ELEMENTS_CLASS.PROFILE.RIGHT}`);
//     post.appendChild(renderUserPosts(user))
//     renderCreatePost(container.querySelector(`.${ELEMENTS_CLASS.PROFILE.RIGHT}`))
//     return container;

//   } catch (error) {
//     console.log("EROR");
//     throw error;
//   }
// }

import { ELEMENTS, ELEMENTS_CLASS, LINKS, LOCATIONS, sidebarLinks } from "../../consts";
import { fetchAjax } from "../../utils/fetchAjax";
import { removeItemLocalStorage } from "../../utils/storages";
import { route } from "../../utils/routing";
import { renderSidebar } from "../feed/feedView";
import {
  getEarnings,
  renderCreatePost,
  renderTip,
  renderUserInfo,
  renderUserPosts,
  renderUserStats,
  renderVibe,
} from "./profileView";
import { VNode } from "../../lib/vdom/src/source";
import { createElement, createText, render, update } from "../../lib/vdom/lib";
import { pageContainer } from "../../index";
import { customizeSidebar } from "../feed/feed";
import { findUsername } from "../../utils/hasLogged";

/**
 * Получение текущего профиля через объект типа промис
 * @returns Информация о пользователе
 */
export function getCurrentUser(link: string) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      link === LINKS.PROFILE.HREF
        ? LOCATIONS.PROFILE.METHOD
        : LOCATIONS.OTHER_PAGE.METHOD,
      link === LINKS.PROFILE.HREF
        ? LOCATIONS.PROFILE.HREF
        : LOCATIONS.OTHER_PAGE.HREF,
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
  const logoutLink = document.createElement("div");
  logoutLink.className = ELEMENTS_CLASS.LOGOUT.COMBINE;
  logoutLink.textContent = "Выйти";
  logoutLink.addEventListener("click", (event: any) => {
    event.preventDefault();
    removeItemLocalStorage(Item);
    route(LINKS.HOME.HREF);
  });
  sidebarLinks.forEach((link: any) => { 
    link.active = false;
  })
  const logout: any = document.createElement("div");
  logout.className = ELEMENTS_CLASS.LOGOUT.BLOCK;
  logout.appendChild(logoutLink);
  return logout;
}

function customizeInfo(container: any, payments: any) {
  const leftbar: any = container.querySelector(
    `.${ELEMENTS_CLASS.PROFILE.LEFT_BAR}`,
  );

  if (window.location.pathname === "/feed/profile") {
    const earnings: any = getEarnings(payments);
    leftbar.appendChild(earnings);
    return earnings;
  }

  const vdomDonate: VNode = createElement(
    "div",
    { class: "donate-container" },
    [
      createElement("button", { class: ELEMENTS_CLASS.DONATE.COMBINE }, [
        createText("Пожертвовать"),
      ]),
    ],
  );

  const containerDonate: any = update(
    document.createElement("div"),
    vdomDonate,
  );
  leftbar.appendChild(containerDonate);

  const modal: any = renderTip();
  const root: any = pageContainer;
  document.body.appendChild(modal);
  const cancel: any = modal.querySelector(`.${ELEMENTS_CLASS.CANCEL.BLOCK}`);

  // Когда пользователь нажимает на кнопку, открываем модальное окно
  containerDonate.addEventListener("click", () => {
    modal.style.display = "block";
    root.classList.add("blur");
  });
  cancel.addEventListener("click", () => {
    modal.style.display = "none";
    root.classList.remove("blur");
  });
}

/**
 * Асинхронная функция рендеринга профиля пользователя.
 * @returns созданный элемент профиля пользователя или 0,
 * если пользователь не найден
 */
export async function renderProfile() {
  try {
    const user: any = await getCurrentUser(window.location.pathname);

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const doc: any = document.body;
    doc.style.height = "100%";

    const vdom: VNode = createElement("div", { class: "main-content" }, [
      createElement("div", { class: ELEMENTS_CLASS.PROFILE.FORM }, [
        createElement("div", { class: ELEMENTS_CLASS.PROFILE.HEADER }, [
          renderVibe(user),
        ]),
        createElement("div", { class: ELEMENTS_CLASS.PROFILE.BLOCK }, [
          renderUserInfo(user, null),
          createElement("div", { class: ELEMENTS_CLASS.PROFILE.RIGHT }, [
            renderUserStats(user, user),
          ]),
        ]),
      ]),
      createElement("div", { class: ELEMENTS_CLASS.SIDEBAR.BLOCK }, [
        createElement("div", { class: ELEMENTS_CLASS.BURGER.BLOCK }, [
          createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
          createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
          createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
        ]),
        createElement("div", { class: ELEMENTS_CLASS.SIDEBAR.ELEMENT }, []),
      ]),
    ]);

    const container = update(pageContainer, vdom);
    const sidebar: any = container.querySelector(
      `.${ELEMENTS_CLASS.SIDEBAR.ELEMENT}`,
    );
    sidebar.appendChild(customizeSidebar(sidebar));

    const userF: any = findUsername();

    if (userF) {
      sidebar.appendChild(renderLogoutButton(userF));
    } else {
      route(LINKS.HOME.HREF);
    }

    customizeInfo(container, user.payments);

    const post: any = container.querySelector(
      `.${ELEMENTS_CLASS.PROFILE.RIGHT}`,
    );
    post.appendChild(renderUserPosts(user));
    renderCreatePost(
      container.querySelector(`.${ELEMENTS_CLASS.PROFILE.RIGHT}`),
    );
    return container;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}
