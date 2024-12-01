import {
  complaintForm,
  containerPopularposts,
  containerRecentlyposts,
} from "../../../widgest/feed/index";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { renderSearchbar } from "../../../entities/searchbar/index";
import * as VDom from "vdom";
import { hasLogged } from "../../../shared/utils/hasLogged";
import { urlCloseModal, urlLeftArrowModal, urlRightArrowModal } from "../../../app";

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
      <div class="modal-view-photos" style="display: none; z-index=10101010">
        <div class="close-modal-view" src={urlCloseModal}></div>
        <div class="modal-container-photos">
          <img class="image-photos-modal"></img>
        </div>
        <div class="slideshow">
          <div class="leftarrow-modal-view" src={urlLeftArrowModal}></div>
          <div class="rightarrow-modal-view" src={urlRightArrowModal}></div>
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
