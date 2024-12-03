export const isTextNode = (vNode: any) =>
  ["string", "number", "boolean"].includes(typeof vNode);

export const isHandler = (attrName: any) => /^on/.test(attrName);

export const createHandler = (...fns: Array<(...args: any[]) => any>) =>
  function (this: any, ...args: any[]) {
    fns.forEach((fn) => fn.apply(this, args));
  };

export const noop = () => {};
