// при найденном значении вызывается плажка с авторами -> запрос к беку, т.е если бек отдал значение все класс все крута.
// Возможность перехода на страницу автора, и не обязательно быть авторизованным
// вызвать метод гет-аккаунт и почистить локалсторажи, для перехода на страницу пользователя

 import { renderSearchbar } from "./ui/ui";
import { searchAuthor } from "./api/api";
import { getAccount } from "../../features/getAccount/getAccount";
import { findUsername } from "../../shared/utils/hasLogged";
import { removeItemLocalStorage } from "../../shared/utils/storages";
//import { route } from "src/shared/routing/routing";

async function showSearch() {
  //const search: any = document.querySelector(`.searchbar-container`);
  const results: any = document.querySelector(`.results`);
  const closeBtn: any = document.querySelector(`.searchbar-icon--right`);
  const searchInput: any = document.querySelector(`.searchbar-input`);
  const searchField: any = document.querySelector("div");
  //const authors: any = await searchAuthor(authorName);
  /*if (authors && authors.length > 0) {
    results.style.display = "block";
  }*/
  closeBtn.addEventListener("click", () => {
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
        authors.forEach((author: any) => {
          const authorElement = document.createElement("div");
          authorElement.classList.add("result-item");
          authorElement.textContent = author.username;

          authorElement.addEventListener("click", async () => {
            await routeToAuthorPage();
          });
          results.appendChild(authorElement);
        });
      } else {
        results.style.display = "none";
      }
    }
  });
}

async function routeToAuthorPage() {
  try {
    const getAuthor = await getAccount();
    if (getAuthor) {
      console.log("Пользователь", getAccount);
    }
  } catch (error) {
    const name = findUsername();
    if (name) {
      removeItemLocalStorage(name);
    }
  }
  //route()
}
 export { renderSearchbar, showSearch };
