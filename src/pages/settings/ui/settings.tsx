import * as VDom from "vdom";
import { createText } from "jsxteamon2/dist/jsxteamon";
import { Sidebar } from "../../../shared/sidebar/sidebar";

export async function settingsContainer(userdata: any) {
  return (
    <div class="main-content">
      {await Sidebar(userdata)}
      <div class="container">
        <h1>Настройки</h1>
        <div class="tabs"></div>
        <div class="content-container"></div>
      </div>
    </div>
  );
}
