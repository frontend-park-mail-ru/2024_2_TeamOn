/**
 * Функция парсинга даты
 * @param isoString
 * @returns
 */
export function convertISOToRussianDate(isoString: string): any {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return null; // Возвращаем null, если строка невалидна
  }

  const day = date.getUTCDate();
  const monthNames = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours() + 3).padStart(2, "0"); // Преобразуем в московское время
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`; // Форматируем строку
}
