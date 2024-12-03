import { isTextNode } from "./utils";
import { patchProps } from "./patchProps";

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
