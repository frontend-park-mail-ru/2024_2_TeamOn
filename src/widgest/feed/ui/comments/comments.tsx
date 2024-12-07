import { hasLogged } from "../../../../shared/utils/hasLogged";
import * as VDom from "vdom";

function containerComment(comment: any) {
  return (
    <div class="comment-item">
      <img class="author-avatar author-comment-avatar"></img>
      <div class="iteraction-section-comment">
        <div class="author-comment-name" style="display: inline-block;">
          {comment.authorUsername}
        </div>
        <div class="comment-title content"></div>
      </div>
      <div
        class="container-delete-comment"
        style="height: 100%;width: 100%;
      display: none;
      justify-content: flex-end;"
      >
        <div class="button-delete-comment">Удалить</div>
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
