import { RouterLinks, state } from "../consts";
import { goToPage } from "../index";
import { hasLogged } from "./hasLogged";
import { route } from "./routing";

export function nonauth() {
  if (!hasLogged()) {
    route(RouterLinks.HOME)
    return true;
  }
}
