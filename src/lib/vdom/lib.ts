import { VirtualDOM } from "./src/source";
import { VNode } from "./src/source";

function createElement(
  type: string,
  props: { [key: string]: any },
  children: VNode[],
): VNode {
  return { type, props, children };
}

function createText(text: string): VNode {
  return { type: "text", props: { text }, children: [] };
}

function render(vdom: VirtualDOM): any {
  return vdom.render();
}

export { createElement, createText, VirtualDOM, render };
