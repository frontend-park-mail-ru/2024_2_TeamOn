import * as VDom from "vdom";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { getAccount } from "../../../features/getAccount/getAccount";
import { mediaChange } from "../index";
async function renderCreatePost() {
  const userdata = await getAccount();
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      <div className="container">
        <div className="post-container">
          <h1>Добавление поста</h1>
          <input type="text" placeholder="Введите заголовок поста" />
          <textarea placeholder="Начните писать пост"></textarea>

          <input type="file" id="fileInput" style={{ display: "none" }} />

          <i
            className="fas fa-paperclip attachment-icon"
            onClick={() => document.getElementById("fileInput")?.click()}
          ></i>

          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept=".mp3, mp4, jpeg, pdf, png*"
            onChange={mediaChange}
          />
          <div id="mediaContainer" className="media-container"></div>

          <button className="save-button">Сохранить</button>
          <button className="cancel-button">Отменить</button>
        </div>

        <div className="visibility-container">
          <h2>Кто может смотреть</h2>
          <label>
            <input type="radio" name="visibility" checked /> Только подписчики
          </label>
          <p>Выберите уровень</p>
          {/* Выпадающий список из уровней будет тут */}
        </div>
      </div>
    </div>
  );
}

export { renderCreatePost };
