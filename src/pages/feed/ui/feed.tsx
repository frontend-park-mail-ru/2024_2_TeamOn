import {
  complaintForm,
  containerPopularposts,
  containerRecentlyposts,
} from "../../../widgest/feed/index";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { renderSearchbar } from "../../../entities/searchbar/index";
import * as VDom from "vdom";
import { hasLogged } from "../../../shared/utils/hasLogged";
import { createElement, render, useState } from "../../../../lib/wo";

async function renderFeedForm() {
  const [times, setTimes] = useState(0);
  const onClick = () => setTimes((prev: any) => prev + 1);

  return (
    <div class="main-content">
      {await Sidebar()}
      {renderSearchbar()}
      <div class="right-content">
        <div class="tabs feed">
          <a class="active"> Популярное </a>
          <a> Недавние </a>
        </div>
        {containerPopularposts()}
        {containerRecentlyposts()}
      </div>
      {complaintForm()}
      <div class="modal-view-photos" style="display: none; z-index=10101010">
        <div class="close-modal-view"></div>
        <div class="modal-container-photos">
          <img class="image-photos-modal"></img>
          {/* <video class="image-photos-modal video-modal"></video> */}
          <video
            src="https://rr6---sn-n8v7kn7s.googlevideo.com/videoplayback?expire=1733245870&ei=TudOZ6WRH5qThcIPxKigkQU&ip=46.117.206.16&id=o-AP9-o8O0WrqcHoajMo9TcYyTCkw4d3f7vL3_jwq89vWS&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AQn3pFRDivkiDiTJb00caRB06WhrSJWpRuJZEnxE9Br9K6-y67AmuXcmBKwq3BPaVLHLtJxJD2QRgtVQ&spc=qtApAc2ccPK2jzbuB1BYuOIIo5UcVtKhwtqj2Ucu1289FMuMnxlszRPOWmNWlAo&vprv=1&svpuc=1&mime=video%2Fmp4&ns=auWK1jeysNnrzHziaAJ1AncQ&rqh=1&gir=yes&clen=5158081&ratebypass=yes&dur=118.932&lmt=1731653277352657&fexp=24350590,24350655,24350675,24350705,24350737,51326932,51331020,51335594&c=MWEB&sefc=1&txp=4538434&n=Ns3qEHOZdpRWaQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIgMPN1q6eNs9Pk1rS5LhXrmKJK8uXcnZGEQfwWgED86cECIQClYZ5Cn3DbnLyfHny0dpYo8r-327kL8RLwL8INlqdXDg%3D%3D&title=%D0%A2%D1%80%D0%B5%D0%BD%D0%B1%D0%BE%D0%BB%D0%BE%D0%BD%20%D0%BA%D0%BE%D0%BB%D1%8E%20%D0%B2%20%D0%BE%D1%87%D0%BA%D0%BE%20(%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D0%B0%20%D0%B8%D0%B7%20%D1%82%D0%B8%D0%BA%20%D1%82%D0%BE%D0%BA%D0%B0)&rm=sn-oxu8pnpvo-ua8z7l,sn-ua8e7s&rrc=79,104&req_id=983bf0a8fe44a3ee&cmsv=e&rms=rdu,au&redirect_counter=2&cms_redirect=yes&ipbypass=yes&met=1733234923,&mh=wZ&mip=46.138.212.46&mm=29&mn=sn-n8v7kn7s&ms=rdu&mt=1733234494&mv=m&mvi=6&pl=17&lsparams=ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=AGluJ3MwRQIgDxrSyWgeLaRrCXnoNOPQg5nHR44d_fb5cncO3IXCbmACIQCD3-xiNdnhR_hbd7V8coA99Yk7mBdjWPPWdrCgi8_ZFA%3D%3D"
            poster="https://cdn-icons-png.flaticon.com/256/0/375.png"
            class="image-photos-modal video-modal"
            id="video-player"
            preload="metadata"
          ></video>

          <div
            class="video-hud"
            style="
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;"
          >
            <div
              class="video-hud__element video-hud__action video-hud__action_play"
              id="video-hud__action"
            ></div>
            <div
              class="video-hud__element video-hud__curr-time"
              id="video-hud__curr-time"
            >
              00:00
            </div>
            <progress
              value="0"
              max="100"
              class="video-hud__element video-hud__progress-bar"
              id="video-hud__progress-bar"
            ></progress>
            <div
              class="video-hud__element video-hud__duration"
              id="video-hud__duration"
            >
              00:00
            </div>
            <div
              class="video-hud__element video-hud__mute video-hud__mute_false"
              id="video-hud__mute"
            ></div>
            <input
              type="range"
              value="100"
              max="100"
              title="Громкость"
              class="video-hud__element video-hud__volume"
              id="video-hud__volume"
            ></input>
            <select
              title="Скорость"
              class="video-hud__element video-hud__speed"
              id="video-hud__speed"
            >
              <option value="25">x0.25</option>
              <option value="50">x0.50</option>
              <option value="75">x0.75</option>
              <option value="100" selected>
                x1.00
              </option>
              <option value="125">x1.25</option>
              <option value="150">x1.50</option>
              <option value="175">x1.75</option>
              <option value="200">x2.00</option>
            </select>
            <a
              class="video-hud__element video-hud__download"
              title="Скачать"
              href="video.mp4"
              target="_blank"
              download
            ></a>
            <a
              class="video-hud__download video-hud__element full_hd"
              title="На весь экран"
            ></a>
          </div>
        </div>
        <div class="slideshow">
          <div class="leftarrow-modal-view"></div>
          <div class="rightarrow-modal-view"></div>
        </div>
      </div>
    </div>
  );
}

function renderComplaintPost(post: any) {
  if (!hasLogged()) return;

  return (
    <div class="modal__deletepost">
      <div class="modal-header">
        <h2>Жалоба на пост</h2>
      </div>
      <div class="form-group">
        <p class="textarea-group-delete">
          Вы действительно хотите подать жалобу на пост {post.title} ?
        </p>
      </div>
      <div class="form-actions">
        <button class="cancel cancel__button cancel__button__effects">
          Закрыть
        </button>
        <button class="delete delete__button delete__button__effects">
          Пожаловаться
        </button>
      </div>
    </div>
  );
}
export { renderFeedForm, renderComplaintPost };
