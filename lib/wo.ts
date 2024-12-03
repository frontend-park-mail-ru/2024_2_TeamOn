const createNode = (vNode: any) => {
  const node = isTextNode(vNode)
    ? document.createTextNode(vNode)
    : document.createElement(vNode.elementName);

  patchProps(node, vNode?.props);

  node.v = vNode;

  return node;
};

const getChildren = (vNode: any) => vNode?.children ?? [];

export const createDOMNode = (vNode: any) => {
  const root = createNode(vNode);

  const stack = []; // { parent, children }, {  }

  stack.push({ parent: root, children: getChildren(vNode) });

  while (stack.length > 0) {
    const poppedItem = stack.pop();
    if (poppedItem) {
      const { parent, children } = poppedItem;
      // Now you can safely use `parent` and `children`
      children.forEach((vChild: any) => {
        const node = createNode(vChild);

        parent.appendChild(node);

        stack.push({ parent: node, children: getChildren(vChild) });
      });
    } else {
      console.log("Stack empty");
    }
  }

  return root;
};

export const createElement = (
  elementName: any,
  props: any,
  ...children: any
) => {
  const chldrn = children.flat();

  if (typeof elementName === "function") {
    const component = () => elementName({ ...props, children: chldrn });

    return {
      ...component(),
      component,
    };
  }

  return {
    elementName,
    props,
    children: chldrn,
  };
};

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

let state: any = 5;

export const useState = function (initialState: any) {
  if (!state) state = initialState;
  const setState = (valueOrFn: any) => {
    if (typeof valueOrFn == "function") {
      state = valueOrFn(state);
    } else {
      // state = valueOrFn(state);
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

const patchNode = (parent: any, node: any, vNode: any) => {
  if (!vNode) return node.remove();

  const isText = isTextNode(vNode);
  const notEqualText = isText && vNode !== node?.v;
  const notEqualElement = node?.v?.elementName !== vNode?.elementName;
  const isNew = !node;

  if (notEqualText || notEqualElement) {
    const newNode = createDOMNode(vNode);

    if (isNew) parent.appendChild(newNode);
    else node.replaceWith(newNode);
  }

  return isText || notEqualText || notEqualElement;
};

// div
// div > hello world

export const patchDOMNode = (node: any, nextVNode: any) => {
  const stack = [{ parent: node.parent, node, vNode: nextVNode }]; // { parent, node, vNode }

  while (stack.length > 0) {
    const item: any = stack.pop();
    const parent = item.parent;
    const iNode = item.node;
    const vNode = item.vNode;

    const isCompleted = patchNode(parent, iNode, vNode);

    if (isCompleted) continue;

    patchProps(iNode, vNode.props);

    const childNodes = iNode.childNodes;
    const vChildren = vNode.children;
    const maxLength = Math.max(childNodes.length, vChildren.length);

    for (let i = 0; i < maxLength; i++) {
      stack.push({
        parent: iNode,
        node: childNodes[i],
        vNode: vChildren[i],
      });
    }
  }
};

// onClick -> onclick
// onMouseEnter -> onmouseenter

const addHandler = (node: any, eventName: any, handler: any) =>
  (node[eventName.toLowerCase()] = createHandler(handler));
const removeHandler = (node: any, eventName: any) => (node[eventName] = noop);

export const patchProps = (node: any, nextProps: any = {}) => {
  const props = node.v?.props ?? {};
  const allProps = { ...props, ...nextProps };

  Object.keys(allProps).forEach((attrName: any) => {
    const value = props[attrName];
    const nextValue = nextProps[attrName];

    const needRemove = !nextValue;
    const notEqual = value !== nextValue;

    if (isHandler(attrName)) {
      if (needRemove) removeHandler(node, attrName);
      else if (notEqual) addHandler(node, attrName, nextValue);
    } else {
      if (needRemove) node.removeAttribute(attrName);
      else if (notEqual) node.setAttribute(attrName, nextValue);
    }
  });

  return node;
};

export const isTextNode = (vNode: any) =>
  ["string", "number", "boolean"].includes(typeof vNode);

export const isHandler = (attrName: any) => /^on/.test(attrName);

export const createHandler = (...fns: Array<(...args: any[]) => any>) =>
  function (this: any, ...args: any[]) {
    fns.forEach((fn) => fn.apply(this, args));
  };

export const noop = () => {};
