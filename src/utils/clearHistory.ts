import { RouterLinks } from "../consts";
import { routing } from "./routing";
import { getItemLocalStorage } from "./storages";

export function ClearHistoryBrowser(): void {
  var hasLoggedInUser = Array.from({ length: localStorage.length }).some(
    (_, i) => getItemLocalStorage(localStorage.key(i)) === "1",
  );

  if (!hasLoggedInUser) {
    routing.history = [];
    routing.currentIndex = -1;

    const homepage = RouterLinks.HOME;
    routing.navigate(homepage);
  }
}
