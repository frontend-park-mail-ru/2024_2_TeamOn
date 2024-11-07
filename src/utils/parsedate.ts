function isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6} \+\d{4} UTC$/;
    return regex.test(dateString);
  }

  function convertToISO(dateString: string): any {
    if (isValidDate(dateString)) {
      // Заменяем пробел на "T" и убираем "UTC"
      const isoFormat = dateString
        .replace(' ', ' ')
        .replace(' UTC', 'Z')
        .slice(0, -17); // Убираем последние 6 символов, т.к. они не нужны в ISO формате
  
      return isoFormat; // Возвращаем преобразованную строку в ISO формате
    }
    return null; // Возвращаем null, если формат невалиден
  }
  

  export {isValidDate, convertToISO}