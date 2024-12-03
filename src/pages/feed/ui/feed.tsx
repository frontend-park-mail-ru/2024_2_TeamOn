import {
  complaintForm,
  containerPopularposts,
  containerRecentlyposts,
} from "../../../widgest/feed/index";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { renderSearchbar } from "../../../entities/searchbar/index";
import * as VDom from "vdom";
import { hasLogged } from "../../../shared/utils/hasLogged";
import { createElement, render, useState } from "../../../../lib/wo";

async function renderFeedForm() {
  const [times, setTimes] = useState(0);
  const onClick = () => setTimes((prev: any) => prev + 1);

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
      <div class="modal-view-photos" style="display: none; z-index=10101010">
        <div class="close-modal-view"></div>
        <div class="modal-container-photos">
          <img class="image-photos-modal"></img>
          {/* <video class="image-photos-modal video-modal"></video> */}
          <video
            class="image-photos-modal video-modal"
            id="video-player"
            preload="metadata"
          ></video>

          <div
            class="video-hud"
            style="
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;"
          >
            <div
              class="video-hud__element video-hud__action video-hud__action_play"
              id="video-hud__action"
            ></div>
            <div
              class="video-hud__element video-hud__curr-time"
              id="video-hud__curr-time"
            >
              00:00
            </div>
            <progress
              value="0"
              max="100"
              class="video-hud__element video-hud__progress-bar"
              id="video-hud__progress-bar"
            ></progress>
            <div
              class="video-hud__element video-hud__duration"
              id="video-hud__duration"
            >
              00:00
            </div>
            <div
              class="video-hud__element video-hud__mute video-hud__mute_false"
              id="video-hud__mute"
            ></div>
            <input
              type="range"
              value="100"
              max="100"
              title="Громкость"
              class="video-hud__element video-hud__volume"
              id="video-hud__volume"
            ></input>
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
            <a
              class="video-hud__element video-hud__download"
              title="Скачать"
              href="video.mp4"
              target="_blank"
              download
            ></a>
            <a
              class="video-hud__download video-hud__element full_hd"
              title="На весь экран"
            ></a>
          </div>
        </div>
        <div class="slideshow">
          <div class="leftarrow-modal-view"></div>
          <div class="rightarrow-modal-view"></div>
        </div>
      </div>
    </div>
  );
}

function renderComplaintPost(post: any) {
  if (!hasLogged()) return;

  return (
    <div class="modal__deletepost">
      <div class="modal-header">
        <h2>Жалоба на пост</h2>
      </div>
      <div class="form-group">
        <p class="textarea-group-delete">
          Вы действительно хотите подать жалобу на пост {post.title} ?
        </p>
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
export { renderFeedForm, renderComplaintPost };
