import * as VDom from "vdom";

/**
 * Рендер бекграунда профиля для десктопа
 * @param background Бекграунд
 * @returns
 */
function renderDesktopProfileHeader(background: any) {
  return (
    <div class="header-profile">
      <form>
        <label
          class="image-upload-label"
          style="display: none"
          type="file"
          accept="image/*"
          htmlFor="image-upload"
        >
          <i class="icon-edit-background"></i>
          Выбрать обложку
        </label>
        <input
          id="image-upload"
          class="image-upload-input"
          type="file"
          accept="image/*"
          style="display: none;"
        ></input>
        <img class="background-image" src={background}></img>
      </form>
    </div>
  );
}

export { renderDesktopProfileHeader };
