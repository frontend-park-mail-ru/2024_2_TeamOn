// VDom.d.ts
declare namespace VDom {
  interface VNode {
    type: string;
    props: {
      [key: string]: any;
      children?: VNode[];
    };
  }

  function createElement(type: string, props?: any, ...children: any[]): VNode;
  function Fragment(props: { children: any[] }): VNode;
  function render(vNode: VNode, container: HTMLElement): void;
}


