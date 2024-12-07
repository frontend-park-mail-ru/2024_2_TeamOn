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
import { modalMediaContainer } from "../../../pages/feed/ui/feed";

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
        {modalMediaContainer()}
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
