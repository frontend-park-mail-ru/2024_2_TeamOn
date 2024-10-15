import { state } from "../consts";
import { goToPage } from "../index";
import { hasLogged } from "./hasLogged";

export function nonauth() {
  if (!hasLogged()) {
    goToPage((state.menuElements as { login: HTMLElement }).login);
    return;
  }
}
