import { ELEMENTS_CLASS, LINKS } from "../../shared/consts/consts";
import { route } from "../../shared/routing/routing";
import { removeItemLocalStorage } from "../../utils/storages";

/**
 * Управления кнопкой выйти
 * @param container Контейнер основной
 * @param authorData Информация об авторе
 */
function controlLogout(container: any, authorData: any) {
    const logoutbutton = container.querySelector(
      `.${ELEMENTS_CLASS.LOGOUT.BLOCK}`,
    );
    logoutbutton.addEventListener("click", (event: any) => {
      event.preventDefault();
      removeItemLocalStorage(authorData.username);
      route(LINKS.HOME.HREF);
    });
  }

  export { controlLogout }