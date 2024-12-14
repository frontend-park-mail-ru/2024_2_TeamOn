import { hasLogged } from "../../../../shared/utils/hasLogged";
import * as VDom from "vdom";

export function contentComment(alo: string = "") {
  return <div class="comment-title content">{alo ? alo : ""}</div>;
}
export function editContentComment() {
  return (
    <textarea class="comment-edit comment-title content textarea-group"></textarea>
  );
}
function containerComment(comment: any, flagEdit: any = null) {
  const flag =
    sessionStorage.getItem("account") === comment.username
      ? `width: 100%;
                  display: flex; justify-content: flex-end;`
      : "display: none;";
  const flagMobile =
    window.innerWidth < 768 ? "" : "height: 100%; min-width: 580px;";
  const flagButtons =
    sessionStorage.getItem("account") === comment.username
      ? "display: flex"
      : "display: none;";
  return (
    <div class="comment-item">
      <img class="author-avatar author-comment-avatar"></img>
      <div class="iteraction-section-comment" style={flagMobile}>
        <div class="favorite-info" style="display: flex;">
          <div class="author-comment-name" style="display: inline-block;">
            {comment.username}
          </div>
          <div class="control-comment" style={flag}>
            <div class="container-edit-comment" style={flagButtons}>
              <div class="button-edit-comment"></div>
            </div>
            <div class="container-delete-comment" style={flagButtons}>
              <div class="button-delete-comment"></div>
            </div>
          </div>
        </div>
        {contentComment()}
        <div
          class="buttons-comment"
          style="display: flex;
          gap: 10px;"
        >
          <div class="cancel-comment" style="display: none; cursor: pointer;">
            Отменить
          </div>
          <div class="save-comment" style="display: none; cursor: pointer">
            Сохранить
          </div>
        </div>
      </div>
    </div>
  );
}

function deleteCommentForm() {
  let flag = "display: block";
  if (!hasLogged()) flag = "display: none;";
  return <div class="delete-comment-form" style={flag}></div>;
}
export { containerComment, deleteCommentForm };
