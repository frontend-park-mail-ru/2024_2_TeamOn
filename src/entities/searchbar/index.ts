// при найденном значении вызывается плажка с авторами -> запрос к беку, т.е если бек отдал значение все класс все крута.
// Возможность перехода на страницу автора, и не обязательно быть авторизованным
// вызвать метод гет-аккаунт и почистить локалсторажи, для перехода на страницу пользователя

import { renderSearchbar } from "./ui/ui";
import { searchAuthor } from "./api/api";
import { findUsername } from "../../shared/utils/hasLogged";
import {
  addItemLocalStorage,
  removeItemLocalStorage,
} from "../../shared/utils/storages";
import { getPageAuthor } from "../../features/getpageauthor/getpageauthor";
import { route } from "../../shared/routing/routing";
import { pageContainer } from "../../app";
import { getAvatar } from "../../features/getavatar/getavatar";

async function showSearch(container: any) {
  const results: any = container.querySelector(`.results`);
  const closeBtn: any = container.querySelector(`.searchbar-icon--right`);
  const searchInput: any = container.querySelector(`.searchbar-input`);
  const searchField: any = container.querySelector("div");
  const containerSearchbar: any =
    container.querySelector(`.searchbar-container`);
  const feedButton: any = container.querySelector(`.feed-buttons`);

  results.style.maxHeight = "300px";
  results.style.overflowY = "auto";

  if (window.location.pathname === "/feed") {
    searchInput.classList.add("feed");
    results.classList.add("feed");
  } else {
    // feedButton.style.display = "none";
    // containerSearchbar.style.display = "none";
    results.classList.add("home");
  }
  closeBtn.addEventListener("click", () => {
    searchInput.value = "";
    results.style.display = "none";
  });
  pageContainer.addEventListener("click", (e: any) => {
    if (e.target === results) {
      return;
    }
    searchInput.value = "";
    results.style.display = "none";
  });
  searchInput.addEventListener("input", async (e: Event) => {
    const authorName = (e.target as HTMLInputElement).value;
    if (authorName.trim()) {
      const authors: any = await searchAuthor(authorName);
      if (authors && authors.length > 0) {
        results.style.display = "block";
        results.innerHTML = "";
        authors.forEach(async (author: any) => {
          const user: any = await getPageAuthor(
            window.location.pathname,
            author,
          );
          // const user = { authorUsername: "author_5",
          //   followers
          //   :
          //   5,
          //   info
          //   :
          //   "Страница самого крутого автора - author_5",
          //   isSubscribe
          //   :
          //   false,
          //   subscriptions
          //   :
          //   []};
          const authorElement = document.createElement("div");
          authorElement.classList.add("result-item");
          authorElement.textContent = user.authorUsername;

          const avatarImage = document.createElement("img");

          const avatarload: any = await getAvatar(
            window.location.pathname,
            author,
          );
          avatarImage.src = avatarload;
          avatarImage.height = 50;
          avatarImage.width = 50;

          authorElement.addEventListener("click", async () => {
            sessionStorage.setItem("authorid", author);
            sessionStorage.setItem("author", user.authorUsername);
            sessionStorage.getItem("account") == user.authorUsername
              ? route(`/profile`)
              : route(`/profile/${author}`);
          });
          authorElement.appendChild(avatarImage);
          results.appendChild(authorElement);
        });
      } else {
        results.style.display = "none";
      }
    }
  });
}

export { renderSearchbar, showSearch };
