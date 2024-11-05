import { ELEMENTS_CLASS, LINKS, LOCATIONS, sidebarLinks } from "../../consts";
import { renderLogoutButton } from "../profile/profile";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { VNode } from "../../lib/vdom/src/source";
import { fetchAjax } from "../../utils/fetchAjax";
import { route } from "../../utils/routing";

export function setActiveLink(link: any) {
  sidebarLinks.forEach((sidebarLink: any) => {
    if (link != sidebarLink) {
      sidebarLink.className = "";
      sidebarLink.active = false;
    }
  });
  link.active = true;
}
function renderBurger() {
  const vdom: VNode = createElement(
    "div",
    { class: ELEMENTS_CLASS.BURGER.BLOCK },
    [
      createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
      createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
      createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
    ],
  );

  return vdom;
}
export async function getAccount() {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.ACCOUNT.GET_ACCOUNT.METHOD,
      "/api/accounts/account",
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 404) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

async function renderSidebar(userdata: any) {
  sessionStorage.setItem("account", userdata.username);
  const vdom: VNode = createElement(
    "div",
    { class: ELEMENTS_CLASS.SIDEBAR.BLOCK },
    [
      renderBurger(),
      createElement("div", { class: ELEMENTS_CLASS.SIDEBAR.ELEMENT }, [
        createElement("div", { class: "nav-menu" }, [
          createElement("a", { class: "referens" }, [
            createElement("i", { class: "icon-home" }, []),
            createText(" Главная"),
          ]),
          // createElement("a", { class: "referens" }, [
          //   createElement("i", { class: "icon-notification" }, []),
          //   createText(" Уведомления"),
          //   createElement("span", { class: "new" }, [createText("НОВОЕ")]),
          // ]),
          createElement("a", { class: "referens" }, [
            createElement("i", { class: "icon-settings" }, []),
            createText(" Настройки"),
          ]),
          createElement("div", { class: "section-profile" }, [
            userdata.role == "Reader"
              ? createElement("div", {}, [])
              : createElement("a", { class: "referens" }, [
                  createElement("i", { class: "icon-profile" }, []),
                  createText(" Профиль"),
                ]),
          ]),
        ]),
        renderLogoutButton(),
      ]),
    ],
  );
  return vdom;
}
// function renderSearchbar() {
//   const vdom: VNode = createElement(
//     "div",
//     { class: ELEMENTS_CLASS.SEARCH.BLOCK },
//     [createElement("input", { class: ELEMENTS_CLASS.SEARCH.ELEMENT }, [])],
//   );

//   return vdom;
// }
function rendermediaContent(mediaContent: any[]) {
  var result: any = [];
  mediaContent.forEach((media: any) => {
    const container: any = createElement(
      "img",
      { class: ELEMENTS_CLASS.POST.MEDIA },
      [],
    );
    result.push(container);
  });
  return result;
}

async function createContainerPost(post: any, mediaContent: any[]) {
  const container = document.createElement("div");
  const vdom: VNode = createElement(
    "div",
    { class: ELEMENTS_CLASS.POST.FEED.BLOCK },
    [
      createElement("div", { class: ELEMENTS_CLASS.POST.AUTHOR.BLOCK }, [
        createElement(
          "img",
          { class: `${ELEMENTS_CLASS.POST.AUTHOR.AVATAR} avatar` },
          [],
        ),
        createElement("div", { class: ELEMENTS_CLASS.POST.AUTHOR.NAME }, [
          createText(post.authorUsername),
        ]),
      ]),
      createElement("div", { class: ELEMENTS_CLASS.POST.TITLE }, [
        createText(post.title),
      ]),
      createElement("div", { class: ELEMENTS_CLASS.POST.CONTENT }, [
        createText(post.content),
      ]),
      ...rendermediaContent(mediaContent),
      createElement("div", { class: ELEMENTS_CLASS.POST.DATE }, [
        createText(post.createdAt),
      ]),
      createElement("div", { class: "interaction-section" }, [
        createElement("div", { class: ELEMENTS_CLASS.POST.LIKES.BLOCK }, [
          createElement(
            "div",
            { class: ELEMENTS_CLASS.POST.LIKES.ELEMENT },
            [],
          ),
          createElement("h3", { class: ELEMENTS_CLASS.POST.LIKES.AMOUNT }, [
            createText(post.likes),
          ]),
        ]),
      ]),
    ],
  );
  update(container, vdom);
  return container;
  // return vdom;
}
export { renderSidebar, createContainerPost };
