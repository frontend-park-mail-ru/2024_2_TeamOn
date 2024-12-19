import * as VDom from "vdom";
import { containerHomeButtons } from "../../../widgest/home/index";
import { renderSearchbar } from "../../../entities/searchbar/index";
import { containerFeedButtons } from "../../../widgest/home/index";
import { urlHomeContainer, urlHomeContainerSec } from "../../../app";

export function containerHome() {
  return (
    <div class="home-container" src={urlHomeContainer}>
      <div class="home-container-sec" src={urlHomeContainerSec}></div>
      <div class="home-overlay"></div>
      <div class="home-header">PUSHART</div>
      <div class="home-description">
        Твой вклад — их вдохновение: создавай вместе с нами!
      </div>
      <div class="searchbar-container">{renderSearchbar()}</div>
      {containerFeedButtons()}
      {containerHomeButtons()}
    </div>
  );
}
