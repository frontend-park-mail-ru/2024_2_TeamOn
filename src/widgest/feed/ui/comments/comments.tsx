import { hasLogged } from "../../../../shared/utils/hasLogged";
import * as VDom from "vdom";

export function contentComment(alo: any = null) {
  return <div class="comment-title content">{alo ? alo : ""}</div>;
}
export function editContentComment() {
  return (
    <textarea class="comment-edit comment-title content textarea-group"></textarea>
  );
}
function containerComment(comment: any, flagEdit: any = null) {
  const flag =
    sessionStorage.getItem("account") === comment.authorUsername
      ? `margin-left: auto;
                  display: flex;`
      : "display: none;";
  const flagMobile = window.innerWidth < 768 ? "" : "height: 100%; width: 100%";
  return (
    <div class="comment-item">
      <img class="author-avatar author-comment-avatar"></img>
      <div class="iteraction-section-comment" style={flagMobile}>
        <div class="favorite-info" style="display: flex;">
          <div class="author-comment-name" style="display: inline-block;">
            {comment.authorUsername}
          </div>
          <div class="control-comment" style={flag}>
            <div
              class="container-edit-comment"
              style="height: 100%;width: 100%;
        display: none;
        justify-content: flex-end;"
            >
              <div class="button-edit-comment"></div>
            </div>
            <div
              class="container-delete-comment"
              style="height: 100%;width: 100%;
        display: none;
        justify-content: flex-end;"
            >
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
