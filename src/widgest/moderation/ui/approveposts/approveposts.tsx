import * as VDom from "vdom";

function containerApprovePosts() {
  const flag = sessionStorage.getItem("moderation")
    ? sessionStorage.getItem("moderation") === "0"
      ? "display: block"
      : "display: none"
    : "display: block";
  return <div class="main-container-approve" style={flag}></div>;
}

export { containerApprovePosts };
