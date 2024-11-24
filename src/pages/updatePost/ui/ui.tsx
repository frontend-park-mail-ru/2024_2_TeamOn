// import * as VDom from "vdom";
// import { Sidebar } from "../../../shared/sidebar/sidebar";
// import { getAccount } from "../../../features/getAccount/getAccount";

// async function renderUpdatePost(post: any) {
//   const userdata = await getAccount();
//   return (
//     <div class="main-content">
//       {await Sidebar(userdata)}
//       <div class="container">
//         <div class="post-container">
//           <h1>Редактирование поста</h1>
//           <input type="text" />
//           <textarea class="input-group">{post.title}</textarea>
//           <textarea class="textarea-group">{post.content}</textarea>
//           <i class="fas fa-paperclip attachment-icon"></i>
//           <button class="cancel cancel__button cancel__button__effects">
//             Сохранить
//           </button>
//           <button class="save save__button save__button__effects">
//             Отменить
//           </button>
//         </div>
//         <div class="visibility-container">
//           <h2>Кто может смотреть</h2>
//           <label>
//             <input type="radio" name="visibility" checked /> Только подписчики
//           </label>
//           <p>Выберите уровень</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export { renderUpdatePost };

import * as VDom from "vdom";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { getAccount } from "../../../features/getAccount/getAccount";
async function containerUpdatePost() {
  const userdata = await getAccount();
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      <div class="container-updatepost">
        <div class="post-container-updatepost">
          <h1>Редактирование поста</h1>
          <div class="form-group-add">
            <input
              class="input-group"
              type="text"
              placeholder="Введите заголовок поста"
            />
          </div>
          <div class="form-group-add">
            <textarea
              class="textarea-group"
              placeholder="Начните писать пост"
            ></textarea>
          </div>
          <form class="form-add-media">
            <label
              class="media-upload-label"
              type="file"
              accept="image/*"
              htmlFor="media-upload"
            >
              <div class="attache-info">
                <i class="icon-attache"></i>
                <h4>Поддерживаемые форматы:</h4>
              </div>
              <div class="formats">
                <h5 class="format">mp3</h5>
                <h5 class="format">mp4</h5>
                <h5 class="format">jpeg</h5>
                <h5 class="format">png</h5>
                <h5 class="format">pdf</h5>
              </div>
            </label>

            <input
              id="media-upload"
              class="media-upload-input"
              type="file"
              accept="image/*"
              style="display: none;"
              name="file"
              multiple
            />
            <div id="mediaContainer" class="container-image-photos"></div>
            <div class="iteraction-container-createpost">
              <button class="save-button">Сохранить</button>
              <button class="cancel-button">Отменить</button>
            </div>
          </form>
        </div>

        <div class="visibility-container-createpost">
          <h2>Кто может смотреть</h2>
          <label>
            <input type="radio" name="visibility" checked /> Только подписчики
          </label>
          <p>Выберите уровень</p>
          {/* Выпадающий список из уровней будет тут */}
        </div>
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
    </div>
  );
}

export { containerUpdatePost };
