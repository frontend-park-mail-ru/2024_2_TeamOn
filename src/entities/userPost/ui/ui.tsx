import { createText } from "../../../../lib/vdom/lib";
import * as VDom from "vdom"

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
          <div class="date">{createText(post.createdAt)}</div>
          <div class="interaction-section">
            <div class="likes-container">
              <div class="likes"></div>
              <h3 class="amount-likes">{createText(post.likes)}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
/**
 * Рендер модального окна создания поста
 * @returns
 */
function renderAddPost() {
    if (window.location.pathname !== "/profile") {
      return <></>;
    }
  
    return (
      <div class="modal__createpost">
        <div class="modal-header">
          <h2>Создание поста</h2>
        </div>
        <div class="form-group">
          <label class="label-tip">Заголовок</label>
          <textarea class="input-group"></textarea>
        </div>
        <div class="form-group">
          <label class="label-group">Содержание</label>
          <textarea class="textarea-group"></textarea>
        </div>
        <div class="form-actions">
          <button class="cancel cancel__button cancel__button__effects">
            Закрыть
          </button>
          <button class="send-tip send-tip__button send-tip__button__effects">
            Создать
          </button>
        </div>
      </div>
    );
  }
  function renderEditPost(post: any) {
      return (
        <div class="modal__editpost">
          <div class="modal-header">
            <h2>Редактирование</h2>
          </div>
          <div class="form-group">
            <label class="label-tip">Заголовок</label>
            <textarea class="input-group">{post.title}</textarea>
          </div>
          <div class="form-group">
            <label class="label-group">Содержание</label>
            <textarea class="textarea-group">{post.content}</textarea>
            <div class="char-count"></div>
          </div>
          <div class="form-actions">
            <button class="cancel cancel__button cancel__button__effects">
              Закрыть
            </button>
            <button class="save save__button save__button__effects">
              Сохранить
            </button>
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

  export { renderUserPost, renderEditPost, renderDeletePost, renderAddPost  }