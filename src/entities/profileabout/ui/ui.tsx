import { createText } from "../../../../lib/vdom/lib";
import * as VDom from "vdom"

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
          value={newValue == undefined ? "Мой статус..." : newValue}
        ></input>
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
        <button class="edit-info-button" style={flag}>
          Изменить
        </button>
      </div>
    );
    return isEdit ? editModeValue : defaultModeValue;
  }