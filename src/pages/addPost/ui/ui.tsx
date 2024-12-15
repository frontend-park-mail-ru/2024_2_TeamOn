import * as VDom from "vdom";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { urlIconAttache } from "../../../app";

function containerLayer(layer: any) {
  const name: any = layer.title ? layer.title : layer.layerName;
  return (
    <label class="modal-label-layers">
      <input
        class="modal-layers"
        id={layer.layer}
        type="radio"
        name="visibility"
        checked
      />
      <h4>{name}</h4>
    </label>
  );
}

async function containerCreatePost() {
  return (
    <div class="main-content">
      {await Sidebar()}
      <h1>Добавление поста</h1>
      <div class="container-createpost">
        <div class="post-container-createpost">
          <div class="form-group-add">
            <input
              class="input-group"
              type="text"
              placeholder="Введите заголовок поста"
            />
          </div>
          <div class="form-group-add">
            <textarea
              class="textarea-group"
              placeholder="Начните писать пост"
            ></textarea>
          </div>
          <form class="form-add-media">
            <label
              class="media-upload-label"
              type="file"
              accept="image/*"
              htmlFor="media-upload"
            >
              <div class="attache-info">
                <i class="icon-attache"></i>
                <h4>Поддерживаемые форматы:</h4>
              </div>
              <div class="formats">
                <h5 class="format">mp3</h5>
                <h5 class="format">mp4</h5>
                <h5 class="format">jpeg</h5>
                <h5 class="format">jpg</h5>
                <h5 class="format">png</h5>
                <h5 class="format">pdf</h5>
              </div>
            </label>

            <input
              id="media-upload"
              class="media-upload-input"
              type="file"
              accept="image/*"
              style="display: none;"
              name="file"
              multiple
            />
            <div id="mediaContainer" class="container-image-photos"></div>
            <div class="iteraction-container-createpost">
              <button class="save-button">Опубликовать</button>
              <button class="cancel-button">Отменить</button>
            </div>
          </form>
        </div>

        <div class="visibility-container-createpost">
          <h2>Кто может смотреть</h2>
          <div class="layers"></div>
          <p>Выберите уровень</p>
        </div>
      </div>
      <div class="modal-view-photos" style="display: none; z-index=10101010">
        <div class="close-modal-view"></div>
        <div class="modal-container-photos">
          <img class="image-photos-modal"></img>
        </div>
        <div class="slideshow">
          <div class="leftarrow-modal-view"></div>
          <div class="rightarrow-modal-view"></div>
        </div>
      </div>
    </div>
  );
}

export { containerCreatePost, containerLayer };
