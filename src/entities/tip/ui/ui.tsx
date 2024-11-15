import * as VDom from "vdom";

/**
 * Функция рендера модального окна пожертвования
 * @returns
 */
function renderTip() {
    const feedRegex = /^\/profile\/[0-9a-zA-Z-]+$/;
    if (!feedRegex.test(window.location.pathname)) {
      return <></>;
    }
  
    return (
      <div class="modal__tip">
        <div class="modal-header">
          <h2>Пожертвование</h2>
        </div>
        <div class="form-group">
          <label class="label-tip">Сумма</label>
          <textarea class="input-group">360</textarea>
          <div class="amount-count">Минимум 360 рублей</div>
        </div>
        <div class="form-group">
          <label class="label-group">Сообщение</label>
          <textarea class="textarea-group"></textarea>
        </div>
        <div class="form-actions">
          <button class="cancel cancel__button cancel__button__effects">
            Закрыть
          </button>
          <button class="send-tip send-tip__button send-tip__button__effects">
            Отправить
          </button>
        </div>
      </div>
    );
  }

  export { renderTip }