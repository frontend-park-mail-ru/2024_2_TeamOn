import { renderSearchbar } from "./ui/ui";
import { searchAuthor } from "./api/api";
import { getPageAuthor } from "../../features/getpageauthor/getpageauthor";
import { pageContainer } from "../../app";
import { getAvatar } from "../../features/getavatar/getavatar";
import { gotoauthor } from "../../shared/gotoauthor/gotoauthor";
import { Input } from "postcss";

async function showSearch(container: any) {
  const results: any = container.querySelector(`.results`);
  const closeBtn: any = container.querySelector(`.searchbar-icon--right`);
  const find: any = container.querySelector(`.searchbar-icon--left`);
  console.log(find);
  const searchInput: any = container.querySelector(`.searchbar-input`);
  const loader: any = container.querySelector(".loader__search");
  console.log(closeBtn);
  results.style.maxHeight = "300px";
  results.style.overflowY = "auto";

  if (
    window.location.pathname === "/feed" ||
    window.location.pathname === "/moderation"
  ) {
    searchInput.classList.add("feed");
    results.classList.add("feed");
  } else {
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
  });

  const handleInput = async (e: Event) => {
    const authorName = searchInput.value;
    if (authorName.trim().length < 4) {
      results.style.display = "none";
      loader.style.display = "none";
      return;
    }
    if (authorName.trim()) {
      results.style.display = "block";
      loader.style.display = "flex";
      const resultItems = container.querySelectorAll(`.result-item`);
      resultItems.forEach((item: any) => {
        item.remove();
      });
      try {
        const authors: any = await searchAuthor(authorName);
        if (authors && authors.length > 0) {
          const resultItems = container.querySelectorAll(`.result-item`);
          resultItems.forEach((item: any) => {
            item.remove();
          });
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
              gotoauthor(author);
            });
            authorElement.appendChild(avatarImage);
            results.appendChild(authorElement);
          });
        } else {
          results.style.display = "none";
        }
      } catch (error) {
        console.error(error);
      } finally {
        loader.style.display = "none"; // Скрываем лоадер после завершения всех операций
      }
    }
  };
  find.addEventListener("click", () => {
    handleInput(searchInput);
  });
  searchInput.addEventListener("input", throttle(handleInput, 300)); // 300 мс
}
function throttle<T extends (...args: any[]) => any>(func: T, limit: number) {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function (this: unknown, ...args: Parameters<T>): void {
    const context = this;
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
