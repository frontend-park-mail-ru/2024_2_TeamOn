import { isHandler, noop, createHandler } from "./utils";

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
