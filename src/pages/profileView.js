import Handlebars from "handlebars";
import profileTemplate from "../template/profileTemplate.hbs";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts.js";
import { renderLogoutButton } from "./profile.js";

export async function renderProfile(user, payments, posts) {
  const activePage = "Моя страница";

  const data = {
    user,
    payments,
    posts,
    navLinks: ["Моя страница"],
    activePage,
    logoutButton: renderLogoutButton().outerHTML, 
    ELEMENTS,
    ELEMENTS_CLASS
  };

  const template = Handlebars.compile(profileTemplate);
  const html = template(data);


  const profileContainer = document.createElement("div");
  profileContainer.innerHTML = html;
  
  document.body.innerHTML = ""; 
  document.body.appendChild(profileContainer);
}
