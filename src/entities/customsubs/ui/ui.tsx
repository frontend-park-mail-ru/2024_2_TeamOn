import { renderTo, update } from "../../../../lib/vdom/lib";
import { containerLayer } from "../../../pages/addPost/ui/ui";
import * as VDom from "vdom";

async function renderContainersLayer(layers: Array<any>) {
  if (!Array.isArray(layers)) {
    throw new Error("layers should be an array");
  }
  let newAy: any = [];
  let containersLayers: any = [];
  layers.forEach((layer: any) => {
    const container: any = containerLayer(layer);
    newAy.push(container);
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
      <div class="form-group layer-list"></div>
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
      <div
        style="    margin-top: 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;"
      >
        <div class="form-group">
          <h4>{subscription.title}</h4>
        </div>
        <div class="form-group">
          <h4 style="font-weight: normal;">{subscription.description}</h4>
          <div class="char-count"></div>
        </div>
      </div>
      <div class="form-group">
        <h4>{subscription.cost}</h4>
      </div>
      <div
        class="form-group"
        style="display: flex;
    flex-direction: column;
    gap: 15px;"
      >
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
          <a>Оплатить</a>
        </button>
      </div>
      <div
        id="successMessage"
        class="scroll-message"
        style="display: none;"
      ></div>
    </div>
  );
}
function renderModalUnfollow(authorData: any) {
  return (
    <div class="modal__unfollow">
      <div class="modal-header">
        <h2>Отмена подписки</h2>
      </div>
      <div class="form-group">
        <p class="textarea-group-delete">
          Вы действительно хотите отписаться от {authorData.authorUsername} ?
        </p>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="delete delete__button delete__button__effects">
          Отписаться
        </button>
      </div>
    </div>
  );
}
export {
  renderModalAddCustomSubs,
  renderContainersLayer,
  renderModalRequestCustomSubs,
  renderModalRealizeCustomSubs,
  renderModalUnfollow,
};
