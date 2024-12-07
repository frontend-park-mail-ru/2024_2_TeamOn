import { urlIconLike } from "../../../app";
import { createText } from "../../../../lib/vdom/lib";
import * as VDom from "vdom";
import { renderPlaceAddComment } from "../../../entities/comments";

/**
 * Рендер контейнера поста
 * @param post Пост
 * @returns
 */

async function renderUserPost(post: any) {
  const flag: any =
    window.location.pathname === "/profile"
      ? "display: block;"
      : "display: none;";

  return (
    <div class="posts">
      <div class="post">
        <div style="display: flex;">
          <div class="menu-icon" style={flag}>
            ⋮
            <div class="dropdown-menu">
              <div class="interaction-post">
                <div class="button-edit-post">Редактировать</div>
              </div>
              <div class="interaction-post">
                <div class="button-delete-post">Удалить</div>
              </div>
            </div>
          </div>
          <h4 class="title">{createText(post.title)}</h4>
        </div>
        <p class="content">{createText(post.content)}</p>
        <div class="toggleButton" style="display: none;">
          Показать...
        </div>
        <div class="container-image-photos"></div>
        <div class="date">{createText(post.createdAt)}</div>
        <div class="interaction-section">
          <div class="likes-container">
            <div class="likes"></div>
            <h3 class="amount-likes">{createText(post.likes)}</h3>
          </div>
          <div class="comments-container">
            <div class="comments"></div>
            <h3 class="amount-comments"></h3>
          </div>
        </div>
        {renderPlaceAddComment()}
        <div class="show-comments" style="display: none;"></div>
      </div>
    </div>
  );
}

/**
 * Рендер удаления поста
 * @param post Пост
 */
function renderDeletePost(post: any) {
  return (
    <div class="modal__deletepost">
      <div class="modal-header">
        <h2>Удаление поста</h2>
      </div>
      <div class="form-group">
        <p class="textarea-group-delete">
          Вы действительно хотите удалить пост{post.title} ?
        </p>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="delete delete__button delete__button__effects">
          Удалить
        </button>
      </div>
    </div>
  );
}

export { renderUserPost, renderDeletePost };
