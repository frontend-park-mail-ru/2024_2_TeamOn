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
        <div class="container-image-photos"></div>
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
export async function fetchFileFromImage(postId: any) {
  const propertiesPost: any = await getUrlFiles(postId);
  const result: any = [];
  for (const content of propertiesPost.mediaContent) {
    const url: any = content.mediaURL;
    const src = "/" + url;
    const response = await fetch(src);
    const blob = await response.blob();
    const fileName: any = src.split("/").pop();
    const fileBlob = new File([blob], fileName, { type: blob.type });
    result.push(fileBlob);
  }
  return result;
}
export async function containerMediaPost(postId: any) {
  const propertiesPost: any = await getUrlFiles(postId);
  let arrayMedia: any = [];
  let mediaId: any = [];
  const imageExtensions = [".jpeg", ".png"];
  if (propertiesPost.mediaContent.length <= 0) return;
  for (const content of propertiesPost.mediaContent) {
    const url: any = content.mediaURL;
    console.log(url);
    mediaId.push(content.mediaID);
    try {
      const response = await fetch("/" + url);
      const isImage = imageExtensions.some((extension) =>
        response.url.toLowerCase().endsWith(extension),
      );
      let containerFile = 0;
      let parts = response.url.split(".");
      const extension = parts.pop();

      if (isImage) {
        containerFile = <img class="image-photo" src={response.url}></img>;
      } else {
        containerFile = (
          <a style="margin-left: 5px;" href={response.url}>
            Файл.{extension}
          </a>
        );
      }
      arrayMedia.push(containerFile);
    } catch (error) {
      console.error("Ошибка при запросе к URL:", url, error);
    }
  }
  console.log(arrayMedia);
  return [arrayMedia, mediaId];
}
export { containerPost };
