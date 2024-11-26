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
          <img
            class="image-photo"
            src="https://i.pinimg.com/236x/93/ed/3a/93ed3af6411e1e8b997038c74c287a8a.jpg"
          ></img>
          <img
            class="image-photo"
            src="https://img.freepik.com/free-photo/heart-shaped-hands-sunset_23-2150169264.jpg"
          ></img>
          <img
            class="image-photo"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9UE1dYBdrFfV1Dz09dGWXy7R8TasGsOk7zQ&s"
          ></img>
          <img
            class="image-photo"
            src="https://avatars.mds.yandex.net/i?id=bb6f43ed6751b908e678f9081d830a85_l-4821174-images-thumbs&n=27&h=480&w=480"
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
  return [arrayMedia, mediaId];
}
export { containerPost };
