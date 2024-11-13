import * as VDom from "vdom";
import { containerHomeButtons } from "../../../widgest/home/index";

export function containerHome() {
  return (
    <div class="home-container">
      <div class="home-container-sec"></div>
      <div class="home-overlay"></div>
      <div class="home-header">PUSHART</div>
      {containerHomeButtons()}
    </div>
  );
}
