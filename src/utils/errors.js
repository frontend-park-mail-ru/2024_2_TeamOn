import DOMPurify from "dompurify";

export function showError(input, message) {
  const error = document.createElement("div");
  error.className = "error";
  error.innerHTML = DOMPurify.sanitize(message);
  input.parentElement.insertBefore(error, input.nextSibling);
  input.classList.add("error-input");
}
export function removeError(inputField) {
  inputField.classList.remove("error-input");
}
