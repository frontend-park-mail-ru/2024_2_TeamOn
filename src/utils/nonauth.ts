import { LINKS } from "../consts";
import { hasLogged } from "./hasLogged";
import { route } from "./routing";

export function nonauth() {
  if (!hasLogged()) {
    route(LINKS.HOME.HREF);
    return true;
  }
}
