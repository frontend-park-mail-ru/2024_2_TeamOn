import {
  containerPopularposts,
  containerRecentlyposts,
} from "../../../widgest/feed/index";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { renderSearchbar } from "../../../entities/searchbar/index";
import * as VDom from "vdom";
import {
  containerApprovePosts,
  containerBlockPost,
  containerReportedPosts,
} from "../../../widgest/moderation";

async function renderModerationForm() {
  return (
    <div class="main-content">
      {await Sidebar()}
      {renderSearchbar()}
      <div class="right-content">
        <div class="tabs feed">
          <a class="active"> Опубликованные </a>
          <a> Жалобы </a>
        </div>
        {containerApprovePosts()}
        {containerReportedPosts()}
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
      {containerBlockPost()}
    </div>
  );
}
/**
 * Рендер удаления поста
 * @param post Пост
 */
function renderBlockPost(post: any) {
  const flag: string =
    localStorage.getItem("dontShowBlockPostModal") == "true"
      ? "display: none"
      : "display: flex";
  return (
    <div class="modal__deletepost">
      <div class="modal-header">
        <h2>Блокировка поста</h2>
      </div>
      <div class="form-group">
        <p class="textarea-group-delete">
          Вы действительно хотите заблокировать пост {post.title} ?
        </p>
        <label class="label-check" style={flag}>
          <input type="checkbox" class="input-check" />
          <h4 style="width: 500px">Не показывать это сообщение</h4>
        </label>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="delete delete__button delete__button__effects">
          Заблокировать
        </button>
      </div>
    </div>
  );
}
export { renderModerationForm, renderBlockPost };
