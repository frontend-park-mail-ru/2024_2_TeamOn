export interface VNode {
  type: string;
  props: { [key: string]: any };
  children: VNode[];
}

export class VirtualDOM {
  private root: VNode;

  constructor(...args: VNode[]) {
    if (args.length === 1) {
      this.root = args[0];
    } else {
      this.root = {
        type: 'fragment',
        props: {},
        children: args
      };
    }
  } 

  public render(): string {
    return this._render(this.root);
  }

  private _render(node: VNode): string {
    if (node.type === "text") {
      return node.props.text;
    }
    if (node.type === 'fragment') {
      let html = '';
      node.children.forEach((child) => {
        html += this._render(child);
      });
      return html;
    }
    var html: any = `<${node.type}`;
    if (node.props) {
      Object.keys(node.props).forEach((key) => {
        html += ` ${key}="${node.props[key]}"`;
      });
    }
    html += ">";

    if (node.children) {
      node.children.forEach((child) => {
        html += this._render(child);
      });
    }

    html += `</${node.type}>`;

    return html;
  }

}
