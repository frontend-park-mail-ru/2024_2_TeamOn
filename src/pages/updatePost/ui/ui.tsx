import * as VDom from "vdom";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { getAccount } from "../../../features/getAccount/getAccount";

async function renderUpdatePost(post: any) {
  const userdata = await getAccount();
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      <div className="container">
        <div className="post-container">
          <h1>Редактирование поста</h1>
          <input type="text" />
          <textarea class="input-group">{post.title}</textarea>
          <textarea class="textarea-group">{post.content}</textarea>
          <i className="fas fa-paperclip attachment-icon"></i>
          <button className="cancel cancel__button cancel__button__effects">Сохранить</button>
          <button className="save save__button save__button__effects">Отменить</button>
        </div>
        <div className="visibility-container">
          <h2>Кто может смотреть</h2>
          <label>
            <input type="radio" name="visibility" checked /> Только подписчики
          </label>
          <p>Выберите уровень</p>
        </div>
      </div>
    </div>
  );
}

export { renderUpdatePost };
