/**
 * Возвращает значение элемента из локального хранилища.
 * @param {*} Item Ключ элемента, значение которого нужно получить
 */
export function getItemLocalStorage(Item: any) {
  try {
    return localStorage.getItem(Item);
  } catch (error) {
    console.error("Ошибка просмотра стоража", error);
  }
}

/**
 * Удаляет элемент из локального хранилища.
 * @param {*} Item Ключ элемента, который нужно удалить
 * @returns
 */
export function removeItemLocalStorage(Item: any) {
  try {
      return localStorage.removeItem(Item);
    } catch (error) {
        console.error("Ошибка удаления стоража", error);
      }
}
    
/**
 * Добавляет элемент в локальное хранилище.
 * @param {*} Item Ключ элемента, который нужно добавить
 * @returns
 */
export function addItemLocalStorage(Item: any) {
  try {
    return localStorage.setItem(Item, "1");
  } catch (error) {
    console.error("Ошибка добавления стоража", error);
  }
}
