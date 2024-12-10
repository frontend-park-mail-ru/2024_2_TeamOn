import { username } from "../../shared/consts/consts";
/**
 * Функция для извлечения имени пользователя из строки
 * @param input - строка, которую нужно проверить
 * @returns имя пользователя без "@" или null, если строка не является именем пользователя
 */
function parseUsername(input: string): string | null {
  const match = input.match(username);

  if (match) {
    return match[1];
  }
  return null;
}

export { parseUsername };
