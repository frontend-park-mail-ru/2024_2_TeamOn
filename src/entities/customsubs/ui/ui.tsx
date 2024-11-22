import { renderTo } from "../../../../lib/vdom/lib";
import { getCustomSubscription } from "../../../features/getCustomSubs/getCustomSubs";
import { containerLayer } from "../../../pages/addPost/ui/ui";
import * as VDom from "vdom";

async function renderContainersLayer() {
  const layers: any = await getCustomSubscription(window.location.pathname);
  let containersLayers: any = [];
  layers.forEach((layer: any) => {
    const container: any = containerLayer(layer);
    const div: any = renderTo(container);
    containersLayers.push(div);
  });
  return containersLayers;
}

function renderModalAddCustomSubs() {
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
        {/* {...renderContainersLayer()}  */}
        {/* <label>
            <input type="radio" name="visibility" checked />
            </label> 
            <label>
            <input type="radio" name="visibility" checked />
            </label> 
            <label>
            <input type="radio" name="visibility" checked />
            </label>  */}
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
function renderModalRequestCustomSubs(subscription: any) {
  return (
    <div class="modal__confirmsubs">
      <div class="pushback" style="display: none;">
        <i class="pushback-icon"></i>
      </div>
      <div class="modal-header">
        <h2>Оформление подписки</h2>
      </div>
      <div class="form-group">
        <h4>{subscription.title}</h4>
      </div>
      <div class="form-group">
        <h4>{subscription.description}</h4>
        <div class="char-count"></div>
      </div>
      <div class="form-group">
        <h4>{subscription.cost}</h4>
      </div>
      <div class="form-group">
        <label for="subscription-duration">Выберите срок подписки:</label>
        <select id="subscription-duration" class="subscription-select">
          <option value="1">1 месяц</option>
          <option value="3">3 месяца</option>
          <option value="6">6 месяцев</option>
        </select>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="save save__button save__button__effects">Далее</button>
      </div>
    </div>
  );
}

function renderModalRealizeCustomSubs(
  subscription: any,
  selectedDuration: any,
) {
  return (
    <div class="modal__confirmsubs">
      <div class="pushback" style="display: block;">
        <i class="pushback-icon"></i>
      </div>
      <div class="modal-header">
        <h2>Подтверждение оплаты</h2>
      </div>
      <div class="form-group">
        <p>Вы собираетесь оформить подписку: </p>
        <h4 style="font-weight: bold;">{subscription.title}</h4>
      </div>
      <div class="form-group">
        <h4>{subscription.description}</h4>
        <div class="char-count"></div>
      </div>
      <div class="form-group">
        <h4> {String(subscription.cost)}₽ в месяц</h4>
      </div>
      <div class="form-group">
        <h4>Срок: {String(selectedDuration)} месяц(-ев)</h4>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="save save__button save__button__effects">
          Оплатить
        </button>
      </div>
      <div id="successMessage" class="scroll-message" style="display: none;">
        {/* Оплата успешно проведена! */}
      </div>
    </div>
  );
}

export {
  renderModalAddCustomSubs,
  renderContainersLayer,
  renderModalRequestCustomSubs,
  renderModalRealizeCustomSubs,
};
