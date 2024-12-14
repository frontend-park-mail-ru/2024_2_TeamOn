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
  let hours: any = date.getUTCHours() + 3; // Преобразуем в московское время

  // Приводим часы к 24-часовому формату
  hours = hours % 24;

  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  hours = String(hours).padStart(2, "0"); // Приводим часы к формату 2 цифры

  return `${day} ${month} ${year} ${hours}:${minutes}`; // Форматируем строку
}
