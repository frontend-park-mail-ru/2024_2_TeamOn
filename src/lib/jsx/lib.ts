import { JSXParser } from "./src/source"
const parser = new JSXParser;
function createElementJSX(jsx: string) {
    return parser.createElementFromJSX(jsx);
}

export {createElementJSX}