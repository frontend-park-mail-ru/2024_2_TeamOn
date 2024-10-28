import { route } from "../../utils/routing";
import { sidebarLinks, LINKS, ELEMENTS_CLASS } from "../../consts";
import { renderLogoutButton } from "../profile/profile";
import { findUsername } from "../../utils/hasLogged";
import { createElement, createText, render, update } from "../../lib/vdom/lib";
import { Virtual } from "../../index";
import { createElementJSX } from "../../lib/jsx/lib";
import { VirtualDOM, VNode } from "../../lib/vdom/src/source";
let previousActiveLink: any = null; // Variable to store the previous active link

export function setActiveLink(link: any) {
  if (previousActiveLink) {
    previousActiveLink.className = "";
    previousActiveLink.active = false;
  }
  link.className = ELEMENTS_CLASS.ACTIVE;
  link.active = true;
  previousActiveLink = link;
  return link.active;
}
function renderBurger() {
  const vdom: VNode = createElement("div", { class: ELEMENTS_CLASS.BURGER.BLOCK }, [
    createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
    createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
    createElement("div", { class: ELEMENTS_CLASS.BURGER.ELEMENT }, []),
  ]);

  return vdom;
}

function renderSidebar() {
  const vdom: VNode = createElement("div", { class: ELEMENTS_CLASS.SIDEBAR.BLOCK }, [
    renderBurger(),
    createElement("div", { class: ELEMENTS_CLASS.SIDEBAR.ELEMENT }, []),
  ]);
  return vdom;
}
function renderSearchbar() {
  const vdom: VNode = createElement(
    "div",
    { class: ELEMENTS_CLASS.SEARCH.BLOCK },
    [createElement("input", { class: ELEMENTS_CLASS.SEARCH.ELEMENT }, [])],
  );

  return vdom;
}

function createContainerPost(post: any) {
  const vdom: VNode = createElement("div", { class: ELEMENTS_CLASS.POST.FEED.BLOCK }, [
      createElement("div", { class: ELEMENTS_CLASS.POST.AUTHOR.BLOCK }, [
        createElement("img", { class: `${ELEMENTS_CLASS.POST.AUTHOR.AVATAR} avatar` }, []),
        createElement("div", { class: ELEMENTS_CLASS.POST.AUTHOR.NAME }, [
          createText(post.authorName),
        ]),
      ]),
      createElement("div", { class: ELEMENTS_CLASS.POST.TITLE }, [
        createText(post.title),
      ]),
      createElement("div", { class: ELEMENTS_CLASS.POST.CONTENT }, [
        createText(post.content),
      ]),
      createElement("img", { class: ELEMENTS_CLASS.POST.MEDIA }, []),
      createElement("div", { class: ELEMENTS_CLASS.POST.DATE }, [
        createText(post.date),
      ]),
      createElement("div", { class: "interaction-section" }, [
        createElement("div", { class: ELEMENTS_CLASS.POST.LIKES.BLOCK }, [
          createElement("div", { class: ELEMENTS_CLASS.POST.LIKES.ELEMENT }, []),
          createElement("h3", { class: ELEMENTS_CLASS.POST.LIKES.AMOUNT }, [
            createText(post.likes),
          ]),
        ]),
        createElement("div", { class: ELEMENTS_CLASS.POST.COMMENTS.BLOCK }, [
          createElement(
            "div",
            { class: ELEMENTS_CLASS.POST.COMMENTS.ELEMENT },
            [],
          ),
          createElement("h3", { class: ELEMENTS_CLASS.POST.COMMENTS.AMOUNT }, [
            createText(post.comments),
          ]),
        ]),
      ]),
  ]);
  return vdom;
}
export { renderSidebar, renderSearchbar, createContainerPost };
