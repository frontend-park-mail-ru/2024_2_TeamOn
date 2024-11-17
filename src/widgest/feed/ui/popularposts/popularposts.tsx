import * as VDom from "vdom";

function containerPopularposts() {
  const flag = sessionStorage.getItem("feed")
    ? sessionStorage.getItem("feed") === "0"
      ? "display: block"
      : "display: none"
    : "display: block";
  return <div class="main-container-popular" style={flag}></div>;
}

export { containerPopularposts };
