import { Sidebar } from "../../../shared/sidebar/sidebar";
import { renderSearchbar } from "../../../entities/searchbar/index";
import * as VDom from "vdom";
import {
  containerPublishPosts,
  containerBlockPost,
  containerReportedPosts,
} from "../../../widgest/moderation";
import { modal } from "../../../pages/feed/ui/feed";

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
        {containerPublishPosts()}
        {containerReportedPosts()}
      </div>
      <div class="modal-view-photos" style="display: none; z-index=10101010">
        {modal()}
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
      ? ` display: flex;
    flex-direction: row-reverse;
    gap: 10px; display: none`
      : `display: flex;
    flex-direction: row-reverse;
    gap: 10px;`;
  return (
    <div class="modal__deletepost">
      <div class="modal-header">
        <h2>Блокировка поста</h2>
      </div>
      <div
        class="form-group"
        style="display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;"
      >
        <p class="textarea-group-delete">
          Вы действительно хотите заблокировать пост{" "}
          <strong>{post.title}</strong> ?
        </p>
        <label class="label-check" style={flag}>
          <input
            style="flex-grow: 1;
    width: 20px;
    height: 20px;
    "
            type="checkbox"
            class="input-check"
          />
          <span style="cursor: pointer;" class="slider"></span>
          <h4>Не показывать это сообщение</h4>
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
