import { renderAbout } from "./ui/ui";
import { MAX_SYMBOLS_ABOUT } from "../../shared/consts/consts";

export function validateAboutText(newValue: string): string {
  if (newValue.length > MAX_SYMBOLS_ABOUT) {
    return `Максимальная длина текста ${MAX_SYMBOLS_ABOUT} символов.`;
  }
  return "";
}
export { renderAbout };
