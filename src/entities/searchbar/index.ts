import { renderSearchbar } from "./ui/ui";

//import { fetchAuthors } from './searchApi';

/**
 * Интерфейс для автора
 */
interface Author {
  id: number;
  name: string;
}

/**
 * Обрабатывает ввод пользователя и отображает совпадения.
 * @param {InputEvent} event - Событие ввода.
 */
export async function resSearch(event: InputEvent): Promise<void> {
  const inputElement = event.target as HTMLInputElement;
  const query = inputElement.value.trim();
  const dropdown = document.getElementById("author-dropdown") as HTMLElement;

  if (!query) {
    dropdown.innerHTML = "";
    dropdown.style.display = "none";
    return;
  }
  /*
    try {
        const authors = await fetchAuthors(query);
        if (authors.length > 0) {
            renderAuthorDropdown(authors);
        } else {
            dropdown.innerHTML = '';
            dropdown.style.display = 'none';
        }
    } catch (error) {
        console.error('Ошибка при поиске авторов:', error);
        dropdown.innerHTML = '';
        dropdown.style.display = 'none';
    }*/
}

/**
 * Рендерит список авторов в всплывающем окне.
 * @param {Author[]} authors - Список авторов.
 */
function renderAuthorDropdown(authors: Author[]): void {
  const dropdown = document.getElementById("author-dropdown") as HTMLElement;
  dropdown.innerHTML = authors
    .map(
      (author) =>
        `<div class="author-item" data-id="${author.id}">${author.name}</div>`,
    )
    .join("");
  dropdown.style.display = "block"; // Приведение к HTMLElement

  // Добавляем обработчики событий на элементы
  dropdown.querySelectorAll(".author-item").forEach((item) => {
    const authorItem = item as HTMLElement; // Приведение к HTMLElement
    authorItem.addEventListener("mouseover", () => {
      authorItem.style.backgroundColor = "black";
      authorItem.style.color = "white";
    });
    authorItem.addEventListener("mouseout", () => {
      authorItem.style.backgroundColor = "";
      authorItem.style.color = "";
    });
  });
}
export { renderSearchbar };
