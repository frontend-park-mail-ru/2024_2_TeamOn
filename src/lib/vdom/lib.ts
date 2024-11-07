import { Virtual } from "../../index";
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

function update(parent: any, content: VNode, vdom: VirtualDOM = Virtual): any {
  return vdom.update(parent, content);
}

function append(
  parent: VNode,
  newChild: VNode,
  vdom: VirtualDOM = Virtual,
): any {
  return vdom.append(parent, newChild);
}
export { createElement, createText, render, update, append };
