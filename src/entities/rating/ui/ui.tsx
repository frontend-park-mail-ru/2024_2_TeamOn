import * as VDom from "vdom";
import { ELEMENTS_CLASS, LINKS } from "../../../shared/consts/consts";
//TODO звезди
// только на ленте
// вспливабщее окно
// бек
// готово
function renderRating() {
  /*const isFeedPage = window.location.pathname===LINKS.FEED.HREF);
  if (!isFeedPage) return;*/

  return (
    <div>
      <div
        id="rating-iframe"
        width="600"
        height="400"
        frameborder="0"
        style="position: fixed; left: 5%; height: 100%; top: 80%; z-index: 10000000;"
      >
        <div class="modal-overlay" id="modal-overlay">
          <div class="rating-widget">
            <h3 class="question">Насколько вы удовлетворены сервисом</h3>
            <div class="stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star inactive"></i>
            </div>
            <button class="button-sendgrade">Отправить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderFrame() {
  return <div>Мой фрейм</div>;
}
export { renderRating, renderFrame };
