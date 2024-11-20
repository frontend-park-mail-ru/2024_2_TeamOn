import * as VDom from "vdom";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { getAccount } from "../../../features/getAccount/getAccount";
function containerAddhotos(src: any) {
  return (
    <div>
      <img src={src} class="image-photo" style="width:100px; margin: 5px"></img>
      <button class="change-file" style="margin-left: 5px;">
        Удалить
      </button>
    </div>
  );
}

async function containerCreatePost() {
  const userdata = await getAccount();
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      <div class="container-createpost">
        <div class="post-container-createpost">
          <h1>Добавление поста</h1>
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
              <i class="icon-attache"></i>
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
          <label>
            <input type="radio" name="visibility" checked /> Только подписчики
          </label>
          <p>Выберите уровень</p>
          {/* Выпадающий список из уровней будет тут */}
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

export { containerCreatePost, containerAddhotos };
