// jsx.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    // Define any custom elements you want to use
    // For example:
    div: any;
    h1: HTMLElement;
    p: HTMLElement;
    // Add more elements as needed
  }

  // Optionally, define the Element type if you have a custom one
  interface Element {
    // You can define your custom element structure here
  }
}
type div = any;
