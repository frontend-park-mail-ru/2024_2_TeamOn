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
  let flag: any =
    window.location.pathname === "/profile"
      ? "padding: 10px; display: block;"
      : "padding: 10px; display: none;";
  let styleStatus = "status-post";
  let titleStatus;
  let styleInitial;
  let state = true;
  let flagBlock = "display: none";
  if (post.status === "PUBLISHED") {
    state = true;
    styleStatus += " ok";
    titleStatus = "Опубликован";
  } else if (post.status === "BLOCKED") {
    state = false;
    flag += " display: none;";
    styleStatus += " display: none";
    titleStatus = "Заблокирован";
    styleInitial = "filter: blur(8px);";
    flagBlock = `
    z-index: 1;
    width: 93%;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    position: absolute;
    flex-direction: column;
    `;
  }
  const flagStatus = post.status
    ? "align-items: center; display: flex;"
    : "align-items: center; display: none;";
  return (
    <div class="posts" style="position: relative;">
      <div style={flagBlock}>
        <div class="sad"></div>
        <h3 style="text-align: center; color: var(--main-color);">
          Твой пост заблокирован. Измени его содержание!
        </h3>
        <div>
          <h2 class="change-post-fast">Изменить</h2>
        </div>
      </div>
      <div class="post">
        <div
          style="align-items: center;
    display: flex;
    justify-content: space-between;"
        >
          <h4 style={styleInitial} class="title">
            {createText(post.title)}
          </h4>
          <div title={titleStatus} class={styleStatus} style={flagStatus}></div>
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
        </div>

        <p style={styleInitial} class="content">
          {createText(post.content)}
        </p>
        <div
          style={styleInitial ? styleInitial : "" + " display: none"}
          class="toggleButton"
        >
          Показать...
        </div>
        <div style={styleInitial} class="container-image-photos"></div>
        <div style={styleInitial} class="date">
          {createText(post.createdAt)}
        </div>
        <div style={styleInitial} class="interaction-section">
          <div class="likes-container">
            <div class="likes"></div>
            <h3 class="amount-likes">{createText(post.likes)}</h3>
          </div>
          <div class="comments-container">
            <div class="comments"></div>
            <h3 class="amount-comments"></h3>
          </div>
        </div>
        {state ? renderPlaceAddComment() : ""}
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
