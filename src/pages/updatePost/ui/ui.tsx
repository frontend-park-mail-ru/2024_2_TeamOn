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
              <i class="icon-attache"></i>
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
    </div>
  );
}

export { containerUpdatePost };
