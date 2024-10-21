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

export function findUsername() {
  var username: any = null;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      console.log(`Ключ: ${key}, Значение: ${localStorage.getItem(key)}`);
      username = key;
    }
  }
  return username;
}
