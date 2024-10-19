import { getItemLocalStorage } from "./storages";

// export function hasLogged() {
//   return Array.from({ length: localStorage.length }).some(
//     (_, i) => getItemLocalStorage(localStorage.key(i)) === "1",
//   );
// }
export function hasLogged() {
  return Array.from({ length: localStorage.length }).some((_, i) => {
    const value = getItemLocalStorage(localStorage.key(i));
    return value === "1"; // Проверяем, что значение не null
  });
}
