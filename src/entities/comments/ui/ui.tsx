import { urlIconLike } from "../../../app";
import { createText } from "../../../../lib/vdom/lib";
import * as VDom from "vdom";

function renderPlaceAddComment() {
  return (
    <div class="place-comments" style="display: none;">
      <div class="comments-loader" style="display: none;">
        <div class="loader__search" style="display: none;"></div>
        <div class="result-item"></div>
      </div>
      <div class="place-content"></div>
      <div class="form-group-comment" style="display: none;">
        <div
          class="container-avatar-comment-add"
          style="display: none;
                  align-content: center;
                  justify-content: center;
                  flex-wrap: wrap;"
        >
          <img class="author-avatar author-comment-avatar"></img>
        </div>
        <div
          class="form-group-add"
          style="    height: 100%;
                  width: 100%;"
        >
          <textarea
            class="textarea-group"
            placeholder="Написать комментарий..."
          ></textarea>
        </div>
        <div class="container-send-comment">
          <i class="button-send-comment"></i>
        </div>
      </div>
    </div>
  );
}
export { renderPlaceAddComment };
