import * as VDom from "vdom";

function containerRecentlyposts() {
  const flag =
    sessionStorage.getItem("feed") === "1" ? "display: block" : "display: none";

  return <div class="main-container-recently" style={flag}></div>;
}

export { containerRecentlyposts };
