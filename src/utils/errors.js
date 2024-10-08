/**
 * Выводит ошибку рядом с полем ввода.
 * @param {*} input Поле ввода, рядом в которым выводится ошибка
 * @param {*} message Текст ошибки
 */
export function showError(input, message) {
  const error = document.createElement("div");
  error.className = "error";
  error.innerHTML = DOMPurify.sanitize(message);
  input.parentElement.insertBefore(error, input.nextSibling);
  input.classList.add("error-input");
}
/**
 * Удаляет ошибку из поля ввода.
 * @param {*} inputField Поле ввода, из которого удаляется ошибка
 */
export function removeError(inputField) {
  inputField.classList.remove("error-input");
}
