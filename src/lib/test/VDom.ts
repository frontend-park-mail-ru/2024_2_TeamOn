// export interface VNode {
//   type: string;
//   props: {
//     [key: string]: any;
//     children?: VNode[] | VNode; // Allow single VNode or an array of VNodes
//   };
// }

// export function createElement(
//   type: string,
//   props: any = {},
//   ...children: any[]
// ): VNode {
//   return {
//     type,
//     props: {
//       ...props,
//       children: children.flat(), // Flatten to support both single and multiple children
//     },
//   };
// }

// export function Fragment(props: { children?: VNode | VNode[] }): VNode {
//   // Ensure children is an array or an empty array if undefined
//   const childrenArray = Array.isArray(props.children)
//     ? props.children
//     : props.children
//       ? [props.children]
//       : [];
//   return {
//     type: "Fragment",
//     props: {
//       children: childrenArray,
//     },
//   };
// }

// export function render(vNode: VNode, container: HTMLElement) {
//   if (typeof vNode === "string") {
//     const textNode = document.createTextNode(vNode);
//     container.appendChild(textNode);
//     return;
//   }

//   const dom: any = document.createElement(vNode.type);

//   for (const [key, value] of Object.entries(vNode.props || {})) {
//     if (key !== "children") {
//       dom[key] = value;
//     }
//   }

//   const children = Array.isArray(vNode.props.children)
//     ? vNode.props.children
//     : [vNode.props.children];
//   children.forEach((child: any) => {
//     render(child, dom);
//   });

//   container.appendChild(dom);
// }
