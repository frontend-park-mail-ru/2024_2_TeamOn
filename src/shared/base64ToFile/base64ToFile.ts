function base64ToFile(base64String: any, fileName: any) {
  // Разделяем строку на части
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1]; // Получаем MIME тип
  const bstr = atob(arr[1]); // Декодируем base64
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  // Заполняем массив байтов
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // Создаем Blob из массива байтов
  const blob = new Blob([u8arr], { type: mime });

  // Создаем объект File из Blob
  return new File([blob], fileName, { type: mime });
}

export { base64ToFile };
