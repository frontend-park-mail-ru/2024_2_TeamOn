import { hasLogged } from "../../../../shared/utils/hasLogged";
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
async function containerPost(post: any) {
  const flag: string = hasLogged() ? "display: block" : "display: none";
  return (
    <div>
      <div class="post-container">
        <div class="header-post" style="display: flex">
          <div class="menu-icon" style={flag}>
            ⋮
            <div class="dropdown-menu">
              <div class="interaction-post">
                <div class="button-delete-post">Пожаловаться</div>
              </div>
            </div>
          </div>
          <div class="author-section">
            <img class="author-avatar avatar"></img>
            <div class="info-post-section">
              <div class="author-name"></div>
              <div class="date"></div>
            </div>
          </div>
        </div>
        <div class="title">{post.title}</div>
        <div class="content">{post.content}</div>
        <div class="toggleButton" style="display: none;">
          Показать...
        </div>
        <div class="container-image-photos"></div>
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
  const mp3Extensions = [".mp3"];
  const mp4Extensions = [".mp4"];
  if (propertiesPost.mediaContent.length <= 0) return;
  for (const content of propertiesPost.mediaContent) {
    const url: any = content.mediaURL;
    mediaId.push(content.mediaID);
    try {
      const response = await fetch("/" + url);
      const isImage = imageExtensions.some((extension) =>
        response.url.toLowerCase().endsWith(extension));
      const isAudio = mp3Extensions.some((extension) =>
        response.url.toLowerCase().endsWith(extension));
      const isVideo = mp4Extensions.some((extension) =>
        response.url.toLowerCase().endsWith(extension));

      let containerFile = 0;

      const fileName = url.split('/').pop(); // Извлекаем имя файла из URL
      const extension = fileName.split('.').pop(); // Получаем расширение файла

      if (isImage) {
        containerFile = <img class="image-photo" src={response.url}></img>;
      } else if (isAudio) {
        containerFile =
        <audio>
          <source src={response.url} type={`audio/${extension}`}></source>
          Ваш браузер не поддерживает аудио.
        </audio>
      } else {
        containerFile = (
          <a style="margin-left: 5px;" href={response.url}>
            Файл.{extension}
          </a>
        );
      }
      // const containerFile = (
      //   <audio>
      //     <source
      //       src="https://zvuk.com/embed/track?id=140047798"
      //       type={`audio/mp3`}
      //     ></source>
      //     Ваш браузер не поддерживает аудио.
      //   </audio>
      // );

      arrayMedia.push(containerFile);
    } catch (error) {
      console.error("Ошибка при запросе к URL:", url, error);
    }
  }
  return [arrayMedia, mediaId];
}
export { containerPost };
