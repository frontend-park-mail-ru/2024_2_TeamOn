import { LINKS } from "../consts/consts";
import { hasLogged } from "./hasLogged";
import { route } from "../routing/routing";

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
