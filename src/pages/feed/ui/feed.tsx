import {
  containerPopularposts,
  containerRecentlyposts,
} from "../../../widgest/feed/index";
import { getAccount } from "../../../features/getAccount/getAccount";
import { Sidebar } from "../../../shared/sidebar/sidebar";

import * as VDom from "vdom";

async function renderFeedForm() {
  const userdata = await getAccount();
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      <div class="right-content">
        <div class="section-title">Популярное</div>
        {containerPopularposts()}
        <div class="section-title">Недавние</div>
        {containerRecentlyposts()}
      </div>
    </div>
  );
}

export { renderFeedForm }
