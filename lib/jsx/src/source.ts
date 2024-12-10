export class JSXParser {
  public parseJSX(jsxAst: string): JSXNode {
    const parser = new DOMParser();
    const doc = parser.parseFromString(jsxAst, "text/html");
    const element = doc.documentElement;

    if (!element) {
      throw new Error(`Invalid JSX: ${jsxAst}`);
    }

    return this.parseElement(element);
  }

  private parseElement(element: Element): JSXNode {
    const node: JSXNode = {
      type: element.tagName.toLowerCase(),
      props: this.parseProps(element.attributes),
      children: this.parseChildren(element.childNodes),
    };

    return node;
  }

  private parseProps(attributes: NamedNodeMap): { [key: string]: any } {
    const props: { [key: string]: any } = {};
    for (let i = 0; i < attributes.length; i++) {
      const attr: any = attributes.item(i);
      props[attr.nodeName] = attr.nodeValue;
    }
    return props;
  }

  private parseChildren(childNodes: NodeList): JSXNode[] {
    const childNodesArray: JSXNode[] = [];
    for (let i = 0; i < childNodes.length; i++) {
      const childNode: any = childNodes.item(i);
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        childNodesArray.push(this.parseElement(childNode));
      } else if (childNode.nodeType === Node.TEXT_NODE) {
        childNodesArray.push({
          type: "text",
          props: { text: childNode.textContent },
          children: [],
        });
      }
    }
    return childNodesArray;
  }
  public createElementFromJSX(jsxAst: any): Element {
    const range = document.createRange();
    const fragment = range.createContextualFragment(jsxAst.toString());
    const element = fragment.firstElementChild as Element;
    return element;
  }

  private createElementFromJSXNode(jsxNode: JSXNode): Element {
    const element = document.createElement(jsxNode.type);
    this.applyProps(element, jsxNode.props);
    this.appendChildren(element, jsxNode.children);
    return element;
  }

  private applyProps(element: Element, props: { [key: string]: any }) {
    for (const key in props) {
      element.setAttribute(key, props[key]);
    }
  }

  private appendChildren(element: Element, children: JSXNode[]) {
    for (const child of children) {
      if (child.type === "text") {
        element.appendChild(document.createTextNode(child.props.text));
      } else {
        const childElement = this.createElementFromJSXNode(child);
        element.appendChild(childElement);
      }
    }
  }
}
interface JSXNode {
  type: string;
  props: { [key: string]: any };
  children: JSXNode[];
}
