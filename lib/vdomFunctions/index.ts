import { createDOMNode } from "./createDOMNode";
import { createElement } from "./createElement";
import { patchDOMNode } from "./patchDOMNode";

// window.h = window.h ?? createElement;

let rootNode: any;
let rootComponent: any;

export const render = (vNode: any, target: any) => {
  rootComponent = vNode.component;

  rootNode = createDOMNode(vNode);

  target.replaceWith(rootNode);
};

const dispatchUpdate = () => {
  patchDOMNode(rootNode, rootComponent());
};

let state: any;

export const useState = function (initialState: any) {
  if (!state) state = initialState;

  const setState = (valueOrFn: any) => {
    if (typeof valueOrFn) {
      state = valueOrFn(state);
    } else {
      state = valueOrFn;
    }

    dispatchUpdate();
  };

  return [state, setState];
};

export default {
  render,
  useState,
};
