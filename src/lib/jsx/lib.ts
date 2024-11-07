import { JSXParser } from "./src/source";
const parser = new JSXParser();
/**
 * Создание элемента JSX
 * @param jsx Синтаксис HTML
 * @returns 
 */
function createElementJSX(jsx: string) {
  return parser.createElementFromJSX(jsx);
}

export { createElementJSX };
