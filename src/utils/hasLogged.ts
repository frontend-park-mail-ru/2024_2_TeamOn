import { getItemLocalStorage } from "./storages";

export function hasLogged() {
  return Array.from({ length: localStorage.length }).some((_, i) => {
    const value = getItemLocalStorage(localStorage.key(i));
    return value === "1"; // Проверяем, что значение не null
  });
}

export function findUsername() {
  return (
    Object.keys(localStorage).find((key) => localStorage.hasOwnProperty(key)) ||
    null
  );
}
