import { hasLogged } from "../../../../shared/utils/hasLogged";
import { getUrlFiles } from "../../../../features/getUrlFiles/getUrlFiiles";
import * as VDom from "vdom";
import { renderPlaceAddComment } from "../../../../entities/comments";
import { getComments } from "../../../../features/controlAdaptivePageAuthor/controlAdaptivePageAuthor";

/**
 * Рендер контейнера поста
 * @param post Пост
 * @param mediaContent Медиа-контент у поста
 * @returns
 */
async function containerPost(post: any) {
  const flag: string =
    hasLogged() && sessionStorage.getItem("role") !== "Moderator"
      ? "display: block"
      : "display: none";
  const comment: any = await getComments(post.postId, 0, 1);
  let flagComment: boolean = false;
  if (comment) {
    flagComment = true;
  }
  // const commentsCount: any = await getComments(post.pistId, 0, 300);

  return (
    <div>
      <div class="post-container">
        <div
          class="header-post"
          style="display: flex;
    justify-content: space-between;"
        >
          <div class="author-section">
            <img class="author-avatar avatar"></img>
            <div class="info-post-section">
              <div class="author-name"></div>
              <div class="date"></div>
            </div>
          </div>
          <div class="menu-icon" style={flag}>
            ⋮
            <div class="dropdown-menu">
              <div class="interaction-post">
                <div class="button-delete-post">Пожаловаться</div>
              </div>
            </div>
          </div>
        </div>
        <div class="title">{post.title}</div>
        <div class="content">{post.content}</div>
        <div class="toggleButton" style="display: none;">
          Показать...
        </div>
        <div class="container-image-photos"></div>
        <div class="iteraction-section" style="display: flex; gap: 10px;">
          <div class="likes-container">
            <div class="likes"></div>
            <h3 class="amount-likes"> {post.likes}</h3>
          </div>
          <div class="comments-container">
            <div class="comments"></div>
            <h3 class="amount-comments">2</h3>
          </div>
        </div>
        {/* {flagComment ? await containerComment(comment) : "" } */}
        {renderPlaceAddComment()}
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

  // const containerFileDev = (
  //   <div class="image-photo video-container">
  //     <video
  //       src="https://rr4---sn-4g5e6nsy.googlevideo.com/videoplayback?expire=1733276022&ei=Fl1PZ-aIObqMv_IPzYWdyAs&ip=102.68.79.121&id=o-AA1z08ZPDR8acdfOFWVnCI-WB2KvD64ZUFwnWeWUWtLV&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AQn3pFTAoQCKGxupgx2mNG8PhGQPA945k5-j3IatvTJZ1kaM3Phg94osEaKYygmkEibgOmIrZ9vXwrYc&vprv=1&mime=video%2Fmp4&rqh=1&gir=yes&clen=8212272&ratebypass=yes&dur=448.911&lmt=1730207763432256&fexp=24350590,24350655,24350675,24350705,24350737,51326932,51335594&c=ANDROID_VR&txp=5319224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Cmime%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRAIgS1A7oQ1zEjJAW4OgHKvKAq21q88tlEmrg4n-inEQaqYCIDL1APLwTd4PJDJrke92M6gayH6bvPn_1ll9ahxvLLUp&title=%D0%BA%D0%B0%D0%BA%20%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C%20Hello%2C%20World!%20%D0%BD%D0%B0%20%D0%B4%D0%B2%D0%BE%D0%B8%D1%87%D0%BD%D0%BE%D0%BC%20%D0%BA%D0%BE%D0%B4%D0%B5%20(GovnBin)&rm=sn-0ofpgxq3x-ocve7e&rrc=79,80&req_id=b5b7194677b2a3ee&cmsv=e&redirect_counter=2&cm2rm=sn-hc5d7d&cms_redirect=yes&met=1733254462,&mh=Cb&mip=176.59.42.224&mm=34&mn=sn-4g5e6nsy&ms=ltu&mt=1733254127&mv=m&mvi=4&pl=22&rms=ltu,au&lsparams=met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=AGluJ3MwRgIhAMXD3M9t87QCC7GwXnp1fq79FHw8I9nM6pDJDgXf2a7PAiEAhU94KZnYogUzFN03Y5BVo65wWUILDHIPjOb0hTF4qBs%3D"
  //       // src="https://rr6---sn-n8v7kn7s.googlevideo.com/videoplayback?expire=1733245870&ei=TudOZ6WRH5qThcIPxKigkQU&ip=46.117.206.16&id=o-AP9-o8O0WrqcHoajMo9TcYyTCkw4d3f7vL3_jwq89vWS&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AQn3pFRDivkiDiTJb00caRB06WhrSJWpRuJZEnxE9Br9K6-y67AmuXcmBKwq3BPaVLHLtJxJD2QRgtVQ&spc=qtApAc2ccPK2jzbuB1BYuOIIo5UcVtKhwtqj2Ucu1289FMuMnxlszRPOWmNWlAo&vprv=1&svpuc=1&mime=video%2Fmp4&ns=auWK1jeysNnrzHziaAJ1AncQ&rqh=1&gir=yes&clen=5158081&ratebypass=yes&dur=118.932&lmt=1731653277352657&fexp=24350590,24350655,24350675,24350705,24350737,51326932,51331020,51335594&c=MWEB&sefc=1&txp=4538434&n=Ns3qEHOZdpRWaQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIgMPN1q6eNs9Pk1rS5LhXrmKJK8uXcnZGEQfwWgED86cECIQClYZ5Cn3DbnLyfHny0dpYo8r-327kL8RLwL8INlqdXDg%3D%3D&title=%D0%A2%D1%80%D0%B5%D0%BD%D0%B1%D0%BE%D0%BB%D0%BE%D0%BD%20%D0%BA%D0%BE%D0%BB%D1%8E%20%D0%B2%20%D0%BE%D1%87%D0%BA%D0%BE%20(%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D0%B0%20%D0%B8%D0%B7%20%D1%82%D0%B8%D0%BA%20%D1%82%D0%BE%D0%BA%D0%B0)&rm=sn-oxu8pnpvo-ua8z7l,sn-ua8e7s&rrc=79,104&req_id=983bf0a8fe44a3ee&cmsv=e&rms=rdu,au&redirect_counter=2&cms_redirect=yes&ipbypass=yes&met=1733234923,&mh=wZ&mip=46.138.212.46&mm=29&mn=sn-n8v7kn7s&ms=rdu&mt=1733234494&mv=m&mvi=6&pl=17&lsparams=ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=AGluJ3MwRQIgDxrSyWgeLaRrCXnoNOPQg5nHR44d_fb5cncO3IXCbmACIQCD3-xiNdnhR_hbd7V8coA99Yk7mBdjWPPWdrCgi8_ZFA%3D%3D"
  //       // src="https://dl.4kdownload.com/video/videodownloaderplus/howto-download-video-in-mp4@av1.mp4"
  //       poster="https://sun9-30.userapi.com/impg/TOar8p5cEgOcFu8x_YIX4YHeobBb8w2dZvvNUQ/pccHJJ07fE0.jpg?size=512x512&quality=96&sign=697258c6f179586c2ddcdc06f36ca17e&type=album"
  //       class="video-player"
  //       id="video-player"
  //       preload="metadata"
  //     ></video>
  //   </div>
  // );
  // const containerFileDevImg = (
  //   <img
  //     class="image-photo"
  //     src="https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-phoenix-bird-in-flames-wallpapers-wallpapershd-image_2697352.jpg"
  //   ></img>
  // );
  // const containerFileDevImg2 = (
  //   <img
  //     class="image-photo"
  //     src="https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-phoenix-bird-in-flames-wallpapers-wallpapershd-image_2697352.jpg"
  //   ></img>
  // );
  // const containerFileDevImg22 = (
  //   <img
  //     class="image-photo"
  //     src="https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-phoenix-bird-in-flames-wallpapers-wallpapershd-image_2697352.jpg"
  //   ></img>
  // );
  // const containerFileDevImg222 = (
  //   <img
  //     class="image-photo"
  //     src="https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-phoenix-bird-in-flames-wallpapers-wallpapershd-image_2697352.jpg"
  //   ></img>
  // );
  // const containerFileDevImg2222 = (
  //   <img
  //     class="image-photo"
  //     src="https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-phoenix-bird-in-flames-wallpapers-wallpapershd-image_2697352.jpg"
  //   ></img>
  // );
  // const containerFileDevImg22222 = (
  //   <img
  //     class="image-photo"
  //     src="https://interier-foto.ru/wp-content/uploads/kupit-bolshie-fotografii.jpg"
  //   ></img>
  // );
  // const containerFileDevImg222222 = (
  //   <img
  //     class="image-photo"
  //     src="https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-phoenix-bird-in-flames-wallpapers-wallpapershd-image_2697352.jpg"
  //   ></img>
  // );
  // const containerFileDevImg2222222 = (
  //   <img
  //     class="image-photo"
  //     src="https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-phoenix-bird-in-flames-wallpapers-wallpapershd-image_2697352.jpg"
  //   ></img>
  // );

  // const containerAudio = (
  //   <figure class="audio">
  //     <figcaption></figcaption>
  //     <audio
  //       controls
  //       src="https://samplelib.com/lib/preview/mp3/sample-3s.mp3"
  //     ></audio>
  //   </figure>
  // );
  // const containerFileDev3 = (
  //   <div class="image-photo video-container">
  //     <video
  //       src="https://rr6---sn-n8v7kn7s.googlevideo.com/videoplayback?expire=1733245870&ei=TudOZ6WRH5qThcIPxKigkQU&ip=46.117.206.16&id=o-AP9-o8O0WrqcHoajMo9TcYyTCkw4d3f7vL3_jwq89vWS&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AQn3pFRDivkiDiTJb00caRB06WhrSJWpRuJZEnxE9Br9K6-y67AmuXcmBKwq3BPaVLHLtJxJD2QRgtVQ&spc=qtApAc2ccPK2jzbuB1BYuOIIo5UcVtKhwtqj2Ucu1289FMuMnxlszRPOWmNWlAo&vprv=1&svpuc=1&mime=video%2Fmp4&ns=auWK1jeysNnrzHziaAJ1AncQ&rqh=1&gir=yes&clen=5158081&ratebypass=yes&dur=118.932&lmt=1731653277352657&fexp=24350590,24350655,24350675,24350705,24350737,51326932,51331020,51335594&c=MWEB&sefc=1&txp=4538434&n=Ns3qEHOZdpRWaQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIgMPN1q6eNs9Pk1rS5LhXrmKJK8uXcnZGEQfwWgED86cECIQClYZ5Cn3DbnLyfHny0dpYo8r-327kL8RLwL8INlqdXDg%3D%3D&title=%D0%A2%D1%80%D0%B5%D0%BD%D0%B1%D0%BE%D0%BB%D0%BE%D0%BD%20%D0%BA%D0%BE%D0%BB%D1%8E%20%D0%B2%20%D0%BE%D1%87%D0%BA%D0%BE%20(%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D0%B0%20%D0%B8%D0%B7%20%D1%82%D0%B8%D0%BA%20%D1%82%D0%BE%D0%BA%D0%B0)&rm=sn-oxu8pnpvo-ua8z7l,sn-ua8e7s&rrc=79,104&req_id=983bf0a8fe44a3ee&cmsv=e&rms=rdu,au&redirect_counter=2&cms_redirect=yes&ipbypass=yes&met=1733234923,&mh=wZ&mip=46.138.212.46&mm=29&mn=sn-n8v7kn7s&ms=rdu&mt=1733234494&mv=m&mvi=6&pl=17&lsparams=ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=AGluJ3MwRQIgDxrSyWgeLaRrCXnoNOPQg5nHR44d_fb5cncO3IXCbmACIQCD3-xiNdnhR_hbd7V8coA99Yk7mBdjWPPWdrCgi8_ZFA%3D%3D"
  //       // src="https://dl.4kdownload.com/video/videodownloaderplus/howto-download-video-in-mp4@av1.mp4"
  //       poster="https://sun9-30.userapi.com/impg/TOar8p5cEgOcFu8x_YIX4YHeobBb8w2dZvvNUQ/pccHJJ07fE0.jpg?size=512x512&quality=96&sign=697258c6f179586c2ddcdc06f36ca17e&type=album"
  //       class="video-player"
  //       id="video-player"
  //       preload="metadata"
  //     ></video>
  //   </div>
  // );

  // arrayMedia.push(containerFileDev);
  // arrayMedia.push(containerFileDevImg);
  // arrayMedia.push(containerFileDevImg2);
  // arrayMedia.push(containerFileDevImg22);
  // arrayMedia.push(containerFileDevImg222);
  // arrayMedia.push(containerFileDevImg2222);
  // arrayMedia.push(containerFileDevImg2222);
  // arrayMedia.push(containerFileDevImg22222);
  // arrayMedia.push(containerFileDevImg22222);
  // arrayMedia.push(containerFileDevImg22222);
  // arrayMedia.push(containerFileDev3);
  // arrayMedia.push(containerAudio);

  // function removeRandomElements(arr: any, count: number) {
  //   const result = [...arr]; // Создаем копию массива, чтобы не изменять оригинал
  //   for (let i = 0; i < count; i++) {
  //     if (result.length === 0) break; // Если массив пуст, выходим из цикла
  //     const randomIndex = Math.floor(Math.random() * result.length); // Генерируем случайный индекс
  //     result.splice(randomIndex, 1); // Удаляем элемент по случайному индексу
  //   }
  //   return result; // Возвращаем новый массив
  // }

  // // Удаляем 1-2 случайных элемента из массива
  // const modifiedArray = removeRandomElements(
  //   arrayMedia,
  //   Math.floor(Math.random() * 2) + 1,
  // );

  // arrayMedia = modifiedArray;
  if (!propertiesPost.mediaContent || propertiesPost.mediaContent.length <= 0)
    return [arrayMedia, mediaId];
  for (const content of propertiesPost.mediaContent) {
    const url: any = content.mediaURL;
    mediaId.push(content.mediaID);
    try {
      const response = await fetch("/" + url);
      const isImage = imageExtensions.some((extension) =>
        response.url.toLowerCase().endsWith(extension),
      );
      const isAudio = mp3Extensions.some((extension) =>
        response.url.toLowerCase().endsWith(extension),
      );
      const isVideo = mp4Extensions.some((extension) =>
        response.url.toLowerCase().endsWith(extension),
      );

      let containerFile = 0;

      const fileName = url.split("/").pop(); // Извлекаем имя файла из URL
      const extension = fileName.split(".").pop(); // Получаем расширение файла

      if (isImage) {
        containerFile = <img class="image-photo" src={response.url}></img>;
      } else if (isVideo) {
        containerFile = (
          <div class="image-photo video-container">
            <video
              src={response.url}
              class="video-player"
              id="video-player"
              preload="metadata"
            ></video>
          </div>
        );
      } else if (isAudio) {
        containerFile = (
          <figure class="audio">
            <figcaption></figcaption>
            <audio controls src={response.url}></audio>
          </figure>
        );
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
