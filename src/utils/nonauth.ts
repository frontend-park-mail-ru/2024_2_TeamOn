import { LINKS } from "../shared/consts/consts";
import { hasLogged } from "./hasLogged";
import { route } from "../shared/routing/routing";

/**
 * Проверка неавторизованности
 * @returns
 */
export function nonauth() {
  if (!hasLogged()) {
    route(LINKS.HOME.HREF);
    return true;
  }
}
