import { renderTo } from "../../../../../lib/vdom/lib";
import { getMediaFiles } from "../../../../features/getMediaFiles/getMediaFiles";
import { getUrlFiles } from "../../../../features/getUrlFiles/getUrlFiiles";
import * as VDom from "vdom";

/**
 * Рендер контейнера поста
 * @param post Пост
 * @param mediaContent Медиа-контент у поста
 * @returns
 */
async function containerPost(postId: any) {
  return (
    <div>
      <div class="post-container">
        <div class="author-section">
          <img class="author-avatar avatar"></img>
          <div class="author-name"></div>
        </div>
        <div class="title"></div>
        <div class="content"></div>
        <div class="toggleButton" style="display: none;">
          Показать...
        </div>
        <div class="container-image-photos">
          {containerMediaPost(postId)}
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

export async function containerMediaPost(postId: any) {
  const propertiesPost: any = await getUrlFiles(postId);
  let arrayMedia: any = [];
  if (propertiesPost.mediaContent.length <= 0) return;
  for (const content of propertiesPost.mediaContent) {
    const url: any = content.mediaURL;
    console.log(url);

    try {
      // const file = await getMediaFiles(url);
      // const response = await fetch(url);
      // const fileBlob = await response.blob();
      // const file = URL.createObjectURL(fileBlob);
      const file = "../myback/" + url;
      const containerFile = <img class="image-photo" src={file}></img>;
      const div: any = renderTo(containerFile);
      arrayMedia.push(div);
    } catch (error) {
      console.error("Ошибка при запросе к URL:", url, error);
    }
  }
  // console.log(arrayMedia);
  return arrayMedia;
}
export { containerPost };
