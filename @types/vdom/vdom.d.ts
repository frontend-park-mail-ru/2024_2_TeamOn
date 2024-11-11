// @types/vdom/vdom.d.ts
declare module "vdom" {
  export function createElement(
    type: any,
    props?: { class?: string; children?: any },
    ...children: any[]
  ): any;

  export const Fragment: (props: { children?: any }) => any;
  export const App: (props: { children?: any }) => any;
  

  export function render(element: any, container: HTMLElement): void;

  export namespace JSX {
    interface IntrinsicElements {
      h1: { children?: any }; 
      p: { children?: any }; 
      div: { [key: string]: any }; 
      form: { [key: string]: any }; 
    }
  }
  

}
