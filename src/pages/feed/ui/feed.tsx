import {
  containerPopularposts,
  containerRecentlyposts,
} from "../../../widgest/feed/index";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { renderSearchbar } from "../../../entities/searchbar/index";
import * as VDom from "vdom";

async function renderFeedForm() {
  return (
    <div class="main-content">
      {await Sidebar()}
      <div class="right-content">
        <div class="tabs feed">
          <a class="active"> Популярное </a>
          <a> Недавние </a>
        </div>
        {containerPopularposts()}
        {containerRecentlyposts()}
      </div>
      {/* <div class="background-modal-view" style="display: none; z-index=10101011"> */}
      <div class="modal-view-photos" style="display: none; z-index=10101010">
        <div class="close-modal-view"></div>
        <div class="modal-container-photos">
          <img class="image-photos-modal"></img>
        </div>
        <div class="slideshow">
          <div class="leftarrow-modal-view"></div>
          <div class="rightarrow-modal-view"></div>
        </div>
      </div>
    </div>
  );
}

export { renderFeedForm };
