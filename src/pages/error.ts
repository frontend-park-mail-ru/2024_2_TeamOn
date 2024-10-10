import { ELEMENTS, ELEMENTS_CLASS } from "../consts";
import { goToPage } from "../index";
import { state } from "../consts";

/**
 * Обработка ошибок
 * @param {*} statusErr Статус ошибки
 */
export function renderError(statusErr = 404) {
  const notFoundDiv = document.createElement(ELEMENTS.DIV) as HTMLInputElement;
  const notFoundContainer = document.createElement(
    ELEMENTS.DIV,
  ) as HTMLInputElement;
  const notFound404 = document.createElement(ELEMENTS.DIV) as HTMLInputElement;
  const h1 = document.createElement(ELEMENTS.H1) as HTMLInputElement;
  const h2 = document.createElement(ELEMENTS.H2) as HTMLInputElement;
  const a = document.createElement(ELEMENTS.A) as HTMLInputElement;
  const span = document.createElement(ELEMENTS.SPAN) as HTMLInputElement;

  notFoundDiv.id = "notfound";

  notFoundContainer.className = ELEMENTS_CLASS.NOTFOUND;

  notFound404.className = ELEMENTS_CLASS.NOTFOUND_404;

  h1.textContent = statusErr.toString();

  h2.textContent = "Страница не найдена";

  a.onclick = () => {
    goToPage((state.menuElements as { home: HTMLElement }).home);
  };
  span.className = ELEMENTS_CLASS.ARROW;
  a.appendChild(span);
  a.appendChild(document.createTextNode("Вернуться на главную"));

  notFound404.appendChild(h1);
  notFoundContainer.appendChild(notFound404);
  notFoundContainer.appendChild(h2);
  notFoundContainer.appendChild(a);
  notFoundDiv.appendChild(notFoundContainer);

  return notFoundDiv;
}
