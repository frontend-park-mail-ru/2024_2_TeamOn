/**
 * Возвращает значение элемента из локального хранилища.
 * @param {*} Item Ключ элемента, значение которого нужно получить
 */
export function getItemLocalStorage(Item) {
  return localStorage.getItem(Item);
}

/**
 * Удаляет элемент из локального хранилища.
 * @param {*} Item Ключ элемента, который нужно удалить
 * @returns
 */
export function removeItemLocalStorage(Item) {
  return localStorage.removeItem(Item);
}

/**
 * Добавляет элемент в локальное хранилище.
 * @param {*} Item Ключ элемента, который нужно добавить
 * @returns
 */
export function addItemLocalStorage(Item) {
  return localStorage.setItem(Item, "1");
}
