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
export function fetchAjax(
  method: any,
  url: any,
  body?: any,
  callback: (response: Response) => void = () => {},
) {
  const headers: any = {};

  if (body) {
    headers["Content-Type"] = "application/json; charset=utf-8";
    body = JSON.stringify(body);
  }
  const init = {
    method,
    headers,
    ...(body ? { body } : {}),
    mode: "cors" as RequestMode,
    credentials: "include" as RequestCredentials,
  };
  return fetch(url, init)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      throw error;
    });
}
