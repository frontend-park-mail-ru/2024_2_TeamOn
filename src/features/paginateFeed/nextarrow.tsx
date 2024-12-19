import * as VDom from "vdom";

function renderNextArrow(count: string) {
  return (
    <div class="next-media">
      <div class="next-arrow-media"></div>И еще {count}
    </div>
  );
}

export { renderNextArrow };
