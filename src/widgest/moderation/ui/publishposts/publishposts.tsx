import * as VDom from "vdom";

function containerPublishPosts() {
  const flag = sessionStorage.getItem("moderation")
    ? sessionStorage.getItem("moderation") === "0"
      ? "display: block"
      : "display: none"
    : "display: block";
  return <div class="main-container-publish" style={flag}></div>;
}

export { containerPublishPosts };
