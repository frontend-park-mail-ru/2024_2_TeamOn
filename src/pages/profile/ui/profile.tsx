import { Sidebar } from "../../../shared/sidebar/sidebar";
import * as VDom from "vdom";
import {
  addCustomSubsForm,
  deletepostForm,
  tipForm,
  profileForm,
  confirmForm,
  unfollowForm,
  followersForm,
} from "../../../widgest/profile";
import { renderUserInfo } from "../../../entities/profileInfo/index";
import { urlAddCustomSubs } from "../../../app";

/**
 * Рендер основного контента
 * @param authorData Данные об авторе
 * @param avatar Аватар
 * @param background Бекграунд
 * @param userdata Данные о пользователе
 * @param payments Выплаты
 * @returns
 */

export async function profileContent(
  authorData: any,
  avatar: any,
  background: any,
  payments: any,
) {
  return (
    <div class="main-content">
      {await Sidebar()}
      {await profileForm(authorData, avatar, background, payments)}
      <div class="modal-view-photos" style="display: none; z-index=10101010">
        <div class="close-modal-view"></div>
        <div class="modal-container-photos">
          <img class="image-photos-modal"></img>
          <video
            class="image-photos-modal video-modal"
            id="video-player"
            preload="metadata"
          ></video>
          <div>
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
        </div>
        <div class="slideshow">
          <div class="leftarrow-modal-view"></div>
          <div class="rightarrow-modal-view"></div>
        </div>
      </div>
      {tipForm()}
      {addCustomSubsForm()}
      {deletepostForm()}
      {confirmForm()}
      {unfollowForm()}
      {followersForm()}
    </div>
  );
}

/**
 * Рендер мобильного профиля
 * @param user Пользователь
 * @param avatar Аватар
 * @param background Бекграунд
 * @param payments Выплаты
 * @returns
 */
export async function mobilepr(
  user: any,
  avatar: any,
  background: any,
  payments: any,
) {
  const flag = window.location.pathname === "/profile" ? "" : "display: none;";
  return (
    <div class="mobile-profile">
      <div class="profile-header-mobile">
        <img class="profile-avatar" src={avatar} height="90" width="90"></img>
        <input
          id="image-upload-mobile"
          class="image-upload-input-mobile"
          type="file"
          accept="image/*"
          style="display: none;"
        ></input>
        <img class="background-image-mobile" src={background}></img>
        <button class="change-cover-button-mobile" style={flag}>
          {" "}
          Выбрать обложку{" "}
        </button>
      </div>
      <div class="tabs-mobile">
        <div class="about-mobile__button"> ПРОФИЛЬ </div>
        <div class="posts-mobile__button"> ЛЕНТА </div>
      </div>
      <div class="content-mobile">{await renderUserInfo(user, payments)}</div>
    </div>
  );
}

function renderContainerAddCustomSubs() {
  const flag: any =
    window.location.pathname === "/profile" ? "display: flex" : "display: none";

  return (
    <div class="add-customsubs" style={flag}>
      <i class="add-customsubs-icon"></i>
    </div>
  );
}

export { renderContainerAddCustomSubs };
