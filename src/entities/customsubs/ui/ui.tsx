import * as VDom from "vdom";

function renderAddCustomSubs() {
  return (
    <div class="modal__addsubs">
      <div class="modal-header">
        <h2>Создание подписки</h2>
      </div>
      <div class="form-group">
        <label class="label-tip">Название</label>
        <textarea class="input-group"></textarea>
      </div>
      <div class="form-group">
        <label class="label-group">Описание</label>
        <textarea class="textarea-group"></textarea>
        <div class="char-count"></div>
      </div>
      <div class="form-group">
        <label class="label-tip">Стоимость</label>
        <textarea class="input-group"></textarea>
      </div>
      <div class="form-group layer-list">
        {/* {containerLayer()} */}
        {/* <label>
            <input type="radio" name="visibility" checked />
            </label> */}
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="save save__button save__button__effects">
          Сохранить
        </button>
      </div>
    </div>
  );
}

export { renderAddCustomSubs };
