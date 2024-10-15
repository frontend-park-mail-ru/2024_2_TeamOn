import { ELEMENTS, ELEMENTS_CLASS } from "../src/consts";
import { goToPage } from "../src/index";
import { state } from "../src/consts";

/**
 * Обработка ошибок
 * @param {*} statusErr Статус ошибки
 */
export function renderError(statusErr = 404) {
  const notFoundDiv = document.createElement(ELEMENTS.DIV);
  const notFoundContainer = document.createElement(ELEMENTS.DIV);
  const notFound404 = document.createElement(ELEMENTS.DIV);
  const h1 = document.createElement(ELEMENTS.H1);
  const h2 = document.createElement(ELEMENTS.H2);
  const a = document.createElement(ELEMENTS.A);
  const span = document.createElement(ELEMENTS.SPAN);

  notFoundDiv.id = "notfound";

  notFoundContainer.className = ELEMENTS_CLASS.NOTFOUND;

  notFound404.className = ELEMENTS_CLASS.NOTFOUND_404;

  h1.textContent = statusErr.toString();

  h2.textContent = "Страница не найдена";

  a.onclick = () => {
    goToPage(state.menuElements.home);
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
