import { LINKS } from "../shared/consts/consts";
import { routing } from "../shared/routing/routing";
import { getItemLocalStorage } from "./storages";
/**
 * Удаление истории
 */
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
