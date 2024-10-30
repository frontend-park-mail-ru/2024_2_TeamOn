import { LINKS } from "../consts";
import { routing } from "./routing";
import { getItemLocalStorage } from "./storages";

export function clearHistoryBrowser(): void {
  const hasLoggedInUser = Array.from({ length: localStorage.length }).some(
    (_, i) => getItemLocalStorage(localStorage.key(i)) === "1",
  );

  if (!hasLoggedInUser) {
    routing.history = [];
    routing.currentIndex = -1;

    const homepage = LINKS.HOME.HREF;
    routing.navigate(homepage);
  }
}
