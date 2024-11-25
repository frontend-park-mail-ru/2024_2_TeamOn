// при найденном значении вызывается плажка с авторами -> запрос к беку, т.е если бек отдал значение все класс все крута.
// Возможность перехода на страницу автора, и не обязательно быть авторизованным
// вызвать метод гет-аккаунт и почистить локалсторажи, для перехода на страницу пользователя

import { renderSearchbar } from "./ui/ui";
import { searchAuthor } from "./api/api";
import { getPageAuthor } from "../../features/getpageauthor/getpageauthor";
import { route } from "../../shared/routing/routing";
import { pageContainer } from "../../app";
import { getAvatar } from "../../features/getavatar/getavatar";

async function showSearch(container: any) {
  const results: any = container.querySelector(`.results`);
  const closeBtn: any = container.querySelector(`.searchbar-icon--right`);
  const searchInput: any = container.querySelector(`.searchbar-input`);

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

  const handleInput = async (e: Event) => {
    const authorName = (e.target as HTMLInputElement).value;
    if (authorName.trim().length < 4) {
      results.style.display = "none";
      return;
    }
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
  };
  searchInput.addEventListener("input", throttle(handleInput, 300)); // 300 мс
}
function throttle<T extends (...args: any[]) => any>(func: T, limit: number) {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function (this: unknown, ...args: Parameters<T>): void {
    const context = this; // Используем this без явного указания типа
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
}

export { renderSearchbar, showSearch };
