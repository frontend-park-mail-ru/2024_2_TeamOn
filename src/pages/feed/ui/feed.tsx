import {
  complaintForm,
  containerPopularposts,
  containerRecentlyposts,
  deleteCommentForm,
} from "../../../widgest/feed/index";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { renderSearchbar } from "../../../entities/searchbar/index";
import * as VDom from "vdom";
import { hasLogged } from "../../../shared/utils/hasLogged";
export function modalMediaContainer() {
  return (
    <div class="modal-container-photos">
      <img class="image-photos-modal"></img>
      <video
        class="image-photos-modal video-modal"
        id="video-player"
        preload="metadata"
      ></video>

      <div class="video-hud">
        <div class="container-test">
          <div class="left-controls-test">
            <div
              alt="Play button"
              class="play-button video-hud__element video-hud__action video-hud__action_play"
              height="20"
              width="20"
            >
              {" "}
            </div>
            <span class="video-hud__element video-hud__curr-time">0:00</span>
            <div style="margin-left: 19px">/</div>
            <span
              class="video-hud__element video-hud__duration"
              id="video-hud__duration"
              style="margin-left: 20px"
            >
              00:00
            </span>
          </div>
          <div class="right-controls-test">
            <div class="volume-container">
              <div
                alt="Volume icon"
                class="volume-icon-test"
                height="20"
                src="https://storage.googleapis.com/a1aa/image/38uweteyq7j3n0FdzOTye6kaofxKPF65zBRAsuaiSwPHYEhPB.jpg"
                width="20"
              >
                <div
                  class="div-volumescale"
                  style="height: 151px;
                            width: 40px;
                            top: -100px;
                            right: 158px;
                            position: absolute;
                            z-index: -1;
                            background-color: #333333;
                            border-radius: 10px;
                            display: none; "
                ></div>
                <input
                  style=" display: none; transform: rotate(270deg); width: 90px; position: absolute;
                            right: 15.2%;
                            top: -48px;
                            background-color: lightblue; border: 1px solid #ccc; border-radius: 5px;"
                  type="range"
                  value="100"
                  max="100"
                  title="Громкость"
                  class="video-hud__element video-hud__volume"
                  id="video-hud__volume"
                ></input>
              </div>
            </div>

            <div class="speed-container">
              <select
                title="Скорость"
                class="video-hud__element video-hud__speed"
                id="video-hud__speed"
              >
                <option value="25">x0.25</option>
                <option value="50">x0.50</option>
                <option value="75">x0.75</option>
                <option value="100" selected>
                  x1.00
                </option>
                <option value="125">x1.25</option>
                <option value="150">x1.50</option>
                <option value="175">x1.75</option>
                <option value="200">x2.00</option>
              </select>
            </div>
            <div class="video-hud__element video-hud__download" title="Скачать">
              <a
                class="download_video"
                download
                target="_blank"
                style=" height: 100%;
                          width: 100%;
                          display: block;"
              ></a>
            </div>
            <div class="video-hud__element full_hd" title="На весь экран"></div>
          </div>
        </div>
        <div class="progress-bar-test">
          <progress value="0" max="100" class="progress-test"></progress>
        </div>
      </div>
    </div>
  );
}
export function modal() {
  return (
    <div>
      <div class="close-modal-view"></div>
      {modalMediaContainer()}
      <div class="slideshow">
        <div class="leftarrow-modal-view"></div>
        <div class="rightarrow-modal-view"></div>
      </div>
    </div>
  );
}
async function renderFeedForm() {
  return (
    <div class="main-content">
      {await Sidebar()}
      {renderSearchbar()}
      <div class="right-content">
        <div class="tabs feed">
          <a class="active"> Популярное </a>
          <a> Недавние </a>
        </div>
        {containerPopularposts()}
        {containerRecentlyposts()}
      </div>
      {complaintForm()}
      {deleteCommentForm()}
      <div class="modal-view-photos" style="display: none; z-index=10101010">
        {modal()}
      </div>
    </div>
  );
}
export function renderLoader() {
  return (
    <div class="mask">
      <div class="loader"></div>
    </div>
  );
}
function renderComplaint(content: any, flag: any = null) {
  if (!hasLogged()) return;
  const title = flag ? "Удаление комментария" : "Жалоба на пост";
  const text = flag
    ? `Вы действительно хотите удалить комментарий ?`
    : `Вы действительно хотите подать жалобу на пост ${content.title} ?`;
  return (
    <div class="modal__deletepost">
      <div class="modal-header">
        <h2>{title}</h2>
      </div>
      <div class="form-group">
        <p class="textarea-group-delete">{text}</p>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="delete delete__button delete__button__effects">
          Пожаловаться
        </button>
      </div>
    </div>
  );
}
export { renderFeedForm, renderComplaint };
