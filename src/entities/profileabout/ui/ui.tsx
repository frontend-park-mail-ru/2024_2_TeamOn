import { getAccount } from "../../../features/getAccount/getAccount";
import { createText } from "../../../../lib/vdom/lib";
import * as VDom from "vdom";
import { getPageAuthor } from "../../../features/getpageauthor/getpageauthor";
import { MAX_SYMBOLS_ABOUT } from "../../../shared/consts/consts";

/**
 * Рендер контейнера "О СЕБЕ"
 * @param authorData Информация об авторе
 * @param isEdit Флаг для перехода в режим редактирования
 * @param newValue Новое значение
 * @returns
 */
export function renderAbout(
  authorData: any,
  isEdit = false,
  newValue?: any,
  errorMessage?: string,
) {
  const flag =
    window.location.pathname === "/profile"
      ? "display: block"
      : "display: none;";
  const maxValue =
    newValue && newValue.lentgh > MAX_SYMBOLS_ABOUT
      ? `Максимальная длина текста ${MAX_SYMBOLS_ABOUT} символов.`
      : "";
  let result;

  if (authorData.info == null) {
    if (newValue === undefined) {
      if (window.location.pathname !== "/profile") {
        result = "";
      } else {
        result = "Укажите, чем вы занимаетесь";
      }
    } else {
      result = newValue;
    }
  } else if (
    authorData.info === "Укажите, чем вы занимаетесь" &&
    window.location.pathname !== "/profile"
  ) {
    result = "";
  } else {
    result = authorData.info;
  }
  const editModeValue = (
    <div class="about">
      <h2>ОБ АВТОРЕ</h2>
      <input
        class="about-input"
        value={
          authorData.info == null
            ? "Укажите, чем вы занимаетесь"
            : authorData.info
        }
        /*maxLength={MAX_SYMBOLS_ABOUT}*/
      ></input>
      <p class="about-profile" style="display: none;">
        {createText(
          authorData.info == null
            ? newValue == undefined
              ? "Укажите, чем вы занимаетесь"
              : newValue
            : authorData.info,
        )}
      </p>
      <div class="interaction-place-info">
        <button class="save-info-button">Сохранить</button>
        <button class="cancel-info-button">Отменить</button>
      </div>
    </div>
  );
  const defaultModeValue = (
    <div class="about">
      <h2>ОБ АВТОРЕ</h2>
      <div class="iteraction-about">
        <input
          class="about-input"
          value={
            newValue == undefined ? "Укажите, чем вы занимаетесь" : newValue
          }
          style="display: none;"
        ></input>
        <p class="about-profile">{result}</p>
        <div class="edit-info-button" style={flag}></div>
      </div>
      <div class="interaction-place-info" style="display: none;">
        <button class="save-info-button">Сохранить</button>
        <button class="cancel-info-button">Отменить</button>
      </div>
    </div>
  );

  return isEdit ? editModeValue : defaultModeValue;
}
