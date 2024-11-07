// function isValidDate(dateString: string): boolean {
//     const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6} \+\d{4} UTC$/;
//     return regex.test(dateString);
//   }

//   function convertToISO(dateString: string): any {
//     if (isValidDate(dateString)) {
//       // Заменяем пробел на "T" и убираем "UTC"
//       const isoFormat = dateString
//         .replace(' ', ' ')
//         .replace(' UTC', 'Z')
//         .slice(0, -17); // Убираем последние 6 символов, т.к. они не нужны в ISO формате
  
//       return isoFormat; // Возвращаем преобразованную строку в ISO формате
//     }
//     return null; // Возвращаем null, если формат невалиден
//   }
  
export function convertISOToRussianDate(isoString: string): any {
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
      return null; // Возвращаем null, если строка невалидна
    }
  
    const day = date.getUTCDate();
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 
      'июня', 'июля', 'августа', 'сентября', 'октября', 
      'ноября', 'декабря'
    ];
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours() + 3).padStart(2, '0'); // Преобразуем в московское время
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
    return `${day} ${month} ${year} ${hours}:${minutes}`; // Форматируем строку
  }
  
//   export {isValidDate, convertToISO}