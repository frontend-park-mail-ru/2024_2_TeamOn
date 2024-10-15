import { getItemLocalStorage } from "./storages";

export function hasLogged() {
  return Array.from({ length: localStorage.length }).some(
    (_, i) => getItemLocalStorage(localStorage.key(i)) === "1",
  );
}
