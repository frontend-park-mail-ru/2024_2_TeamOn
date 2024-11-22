import * as VDom from "vdom";
import { containerHomeButtons } from "../../../widgest/home/index";
import { renderSearchbar } from "../../../entities/searchbar/index";
import { containerFeedButtons } from "../../../widgest/home/index";

export function containerHome() {
  return (
    <div class="home-container">
      <div class="home-container-sec"></div>
      <div class="home-overlay"></div>
      <div class="home-header">PUSHART</div>
      <div class="searchbar-container">{renderSearchbar()}</div>
      {containerFeedButtons()}
      {containerHomeButtons()}
    </div>
  );
}
