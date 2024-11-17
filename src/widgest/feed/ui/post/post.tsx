import * as VDom from "vdom";

/**
 * Рендер контейнера поста
 * @param post Пост
 * @param mediaContent Медиа-контент у поста
 * @returns
 */
async function containerPost() {
  return (
    <div>
      <div class="post-container">
        <div class="author-section">
          <img class="author-avatar avatar"></img>
          <div class="author-name"></div>
        </div>
        <div class="title"></div>
        <div class="content"></div>
        <button class="toggleButton" style="display: none;">
          Показать
        </button>
        <div class="container-image-photos">
          {/* <img
            class="image-photo"
            src="https://img.freepik.com/free-photo/rainbow-end-road-landscape_23-2151596720.jpg"
          ></img> */}
          <img
            class="image-photo"
            src="https://static-cse.canva.com/blob/191106/00_verzosa_winterlandscapes_jakob-owens-tb-2640x1485.jpg"
          ></img>
          <img
            class="image-photo"
            src="https://fotoblik.ru/wp-content/uploads/2023/09/azorskie-ostrova-2.webp"
          ></img>
        </div>
        <div class="date"></div>
        <div class="iteraction-section">
          <div class="likes-container">
            <div class="likes"></div>
            <h3 class="amount-likes"></h3>
          </div>
        </div>
      </div>
    </div>
  );
}
export { containerPost };
