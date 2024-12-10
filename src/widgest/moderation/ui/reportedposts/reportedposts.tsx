import * as VDom from "vdom";

function containerReportedPosts() {
  const flag =
    sessionStorage.getItem("moderation") === "1"
      ? "display: block"
      : "display: none";

  return <div class="main-container-reported" style={flag}></div>;
}

export { containerReportedPosts };
