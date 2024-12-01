/**
 * Ручки для получения токена CSRF
 */
const tokenEndpoints: any = {
  auth: "/api/auth/token-endpoint",
  accounts: "/api/accounts/token-endpoint",
  authors_pages: "/api/authors_pages/token-endpoint",
  posts: "/api/posts/token-endpoint",
};
/**
 * Функция получения токена к сервису "посты"
 * @returns
 */
async function getCSRFTokenForPosts() {
  const response = await fetch("/api/posts/token-endpoint");
  const data = await response.json();
  return data;
}

/**
 * Функция получения токена к сервису "логина и регистрации"
 * @returns
 */
async function getCSRFTokenForAuth() {
  const response = await fetch("/api/auth/token-endpoint");
  const data = await response.json();
  return data;
}

/**
 * Функция получения токена к сервису "аккаунт"
 * @returns
 */
async function getCSRFTokenForAccounts() {
  const response = await fetch("/api/accounts/token-endpoint");
  const data = await response.json();
  return data;
}

/**
 * Функция получения токена к сервису "Технический"
 * @returns
 */
async function getCSRFTokenForTech() {
  const response = await fetch("/api/csat/token-endpoint");
  const data = await response.json();
  return data;
}

/**
 * Функция получения токена к сервису "автор"
 * @returns
 */
async function getCSRFTokenForAuthor() {
  const response = await fetch("/api/pages/token-endpoint");
  const data = await response.json();
  return data;
}

/**
 * Функция получения токена к сервису "автор"
 * @returns
 */
async function getCSRFTokenForCSAT() {
  const response = await fetch("/api/csat/token-endpoint");
  const data = await response.json();
  return data;
}
/**
 * Функция получения токена к сервису "модерация"
 * @returns
 */
async function getCSRFTokenForModeration() {
  const response = await fetch("/api/moderation/token-endpoint");
  const data = await response.json();
  return data;
}
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
export async function fetchAjax(
  method: any,
  url: any,
  body?: FormData | any,
  callback: (response: Response) => void = () => {},
) {
  const headers: any = {};

  // Получаем CSRF-токен в зависимости от URL
  if (method === "POST" || method === "DELETE") {
    let csrfToken;
    if (url.startsWith("/api/posts")) {
      csrfToken = await getCSRFTokenForPosts();
    } else if (url.startsWith("/api/auth")) {
      csrfToken = await getCSRFTokenForAuth();
    } else if (url.startsWith("/api/accounts")) {
      csrfToken = await getCSRFTokenForAccounts();
    } else if (url.startsWith("/api/pages")) {
      csrfToken = await getCSRFTokenForAuthor();
    } else if (url.startsWith("/api/tech")) {
      csrfToken = await getCSRFTokenForAccounts();
    } else if (url.startsWith("/api/csat")) {
      csrfToken = await getCSRFTokenForAuthor();
    } else if (url.startsWith("/api/moderation")) {
      csrfToken = await getCSRFTokenForAccounts();
    }

    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken.csrfToken;
    }
  }
  if (body instanceof FormData) {
    // Не устанавливаем Content-Type, он будет установлен автоматически
  } else if (body) {
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
