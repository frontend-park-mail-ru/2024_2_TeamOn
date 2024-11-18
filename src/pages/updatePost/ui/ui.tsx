import * as VDom from "vdom";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { getAccount } from "../../../features/getAccount/getAccount";

async function renderCreatePost() {
  const userdata = await getAccount();
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      <div className="container">
        <div className="post-container">
          <h1>Редактирование поста</h1>
          <input type="text" placeholder="Введите заголовок поста" />
          <textarea placeholder="Начните писать пост"></textarea>
          <i className="fas fa-paperclip attachment-icon"></i>
          <button className="save-button">Сохранить</button>
          <button className="cancel-button">Отменить</button>
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

export { renderCreatePost };
