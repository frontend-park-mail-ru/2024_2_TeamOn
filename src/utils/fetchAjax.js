/**
 * Отправляет запрос AJAX с помощью Fetch API с включенным CORS.
 * @param {*} method    HTTP-метод
 * @param {*} url       URL, на который отправляется запрос
 * @param {*} body      Тело запроса (необязательное)
 * @param {*} callback  Функция обратного вызова, вызываемая с ответом
 * 
Эта функция отправляет запрос AJAX с помощью Fetch API с включенным CORS.
Она устанавливает заголовок Origin в * и включает заголовок Content-Type
со значением application/json; charset=utf-8, если предоставлено тело запроса.
Опция mode установлена в cors, чтобы включить CORS.
 */

export function fetchAjax(method, url, body = null, callback) {
  const headers = {};

  if (body) {
    headers["Content-Type"] = "application/json; charset=utf-8";
    body = JSON.stringify(body);
  }
  const init = {
    method,
    headers,
    body,
    mode: "cors",
    credentials: "include",
  };

  fetch(url, init)
    .then((response) => {
      response.text().then((text) => {
        callback(response, text);
      });
    })
    .catch((error) => {
      callback(null, error.message);
    });
}
