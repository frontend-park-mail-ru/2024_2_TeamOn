import { getItemLocalStorage } from "./storages";

/**
 * Флаг логина
 * @returns
 */
export function hasLogged() {
  return Array.from({ length: localStorage.length }).some((_, i) => {
    const value = getItemLocalStorage(localStorage.key(i));
    return value === "1"; // Проверяем, что значение не null
  });
}
/**
 * Поиск имени
 * @returns
 */
export function findUsername() {
  return (
    Object.keys(localStorage).find((key) => localStorage.hasOwnProperty(key)) ||
    null
  );
}
