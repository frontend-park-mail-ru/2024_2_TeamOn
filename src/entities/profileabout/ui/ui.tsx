import { getAccount } from "../../../features/getAccount/getAccount";
import { createText } from "../../../../lib/vdom/lib";
import * as VDom from "vdom";
import { getPageAuthor } from "../../../features/getpageauthor/getpageauthor";

/**
 * Рендер контейнера "О СЕБЕ"
 * @param authorData Информация об авторе
 * @param isEdit Флаг для перехода в режим редактирования
 * @param newValue Новое значение
 * @returns
 */
export function renderAbout(authorData: any, isEdit = false, newValue?: any) {
  const flag =
    window.location.pathname === "/profile"
      ? "display: block"
      : "display: none;";
  const editModeValue = (
    <div class="about">
      <h2>ОБО МНЕ</h2>
      <input
        class="about-input"
        value={authorData.info == null ? "Мой статус..." : authorData.info}
      ></input>
      <p class="about-profile" style="display: none;">
        {createText(
          authorData.info == null
            ? newValue == undefined
              ? "Изменить статус..."
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
      <h2>ОБО МНЕ</h2>
      <input
        class="about-input"
        value={newValue == undefined ? "Мой статус..." : newValue}
        style="display: none;"
      ></input>
      <p class="about-profile">
        {createText(
          authorData.info == null
            ? newValue == undefined
              ? "Изменить статус..."
              : newValue
            : authorData.info,
        )}
      </p>
      <div class="interaction-place-info" style="display: none;">
        <button class="save-info-button">Сохранить</button>
        <button class="cancel-info-button">Отменить</button>
      </div>
      <button class="edit-info-button" style={flag}>
        Изменить
      </button>
    </div>
  );
  return isEdit ? editModeValue : defaultModeValue;
}
