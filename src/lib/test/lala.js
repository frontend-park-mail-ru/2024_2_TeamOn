const fs = require("fs").promises; // Используем промисы для асинхронного чтения/записи
const path = require("path");
const ts = require("typescript");

async function convertTsxToTs(tsxFilePath) {
  try {
    const tsxCode = await fs.readFile(tsxFilePath, "utf8");

    // Используем TypeScript для преобразования кода
    const result = ts.transpileModule(tsxCode, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.None, // Убираем JSX
      },
    });

    return result.outputText;
  } catch (error) {
    console.error(
      `Ошибка при преобразовании файла ${tsxFilePath}: ${error.message}`,
    );
    return null;
  }
}

async function processDirectory(directory) {
  try {
    const files = await fs.readdir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await processDirectory(filePath); // Рекурсивно обрабатываем поддиректории
      } else if (path.extname(file) === ".tsx") {
        const tsCode = await convertTsxToTs(filePath);
        if (tsCode !== null) {
          const newFilePath = filePath.replace(/\.tsx$/, ".ts");

          await fs.writeFile(newFilePath, tsCode);
          console.log(`Преобразован: ${filePath} -> ${newFilePath}`);
        }
      }
    }
  } catch (error) {
    console.error(
      `Ошибка при обработке директории ${directory}: ${error.message}`,
    );
  }
}

// Укажите директорию, которую нужно обработать
const directoryToProcess = "./"; // Измените на вашу директорию
processDirectory(directoryToProcess).catch((error) =>
  console.error(`Ошибка: ${error.message}`),
);
