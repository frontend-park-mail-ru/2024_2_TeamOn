import { hasLogged } from "../../shared/utils/hasLogged";
import { ELEMENTS_CLASS, LINKS } from "../../shared/consts/consts";
import { route } from "../../shared/routing/routing";
import { removeItemLocalStorage } from "../../shared/utils/storages";

/**
 * Управления кнопкой выйти
 * @param container Контейнер основной
 * @param authorData Информация об авторе
 */
function controlLogout(container: any, authorData: any) {
  if (hasLogged()) {
    const logoutbutton = container.querySelector(
      `.${ELEMENTS_CLASS.LOGOUT.BLOCK}`,
    );
    logoutbutton.addEventListener("click", (event: any) => {
      event.preventDefault();
      removeItemLocalStorage(authorData.username);
      sessionStorage.clear();
      route(LINKS.HOME.HREF);
    });
  }
}

export { controlLogout };
