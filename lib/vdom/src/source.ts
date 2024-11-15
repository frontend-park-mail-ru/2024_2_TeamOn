export interface VNode {
  type: string;
  props: { [key: string]: any };
  children: VNode[];
  class?: any;
}
// export interface VNode {
//   type: string;
//   props: { [key: string]: any };
//   children: (VNode | string)[]; // Изменено на (VNode | string)[]
// }
/**
 * Класс виртуального дома
 */
export class VirtualDOM {
  private root: VNode;

  constructor(...args: VNode[]) {
    if (args.length === 1) {
      this.root = args[0];
    } else {
      this.root = {
        type: "fragment",
        props: {},
        children: args,
      };
    }
  }

  public render(): string {
    return this._render(this.root);
  }
  public renderTo(container: VNode, className: any = null): string {
    const parent: any = document.createElement("div");
    if (className) {
      parent.className = className;
    }
    const content: string = this._render(container);
    parent.innerHTML = content;
    return parent;
  }
  private _render(node: VNode): string {
    if (node.type === "text") {
      return node.props.text;
    }
    if (node.type === "fragment") {
      let html = "";
      node.children.forEach((child: any) => {
        html += this._render(child);
      });
      return html;
    }

    let html: string = `<${node.type}`;
    if (node.props) {
      // Обработка классов
      if (node.props.class) {
        html += ` class="${node.props.class}"`; // Добавляем классы
      }
      // Обработка всех остальных атрибутов
      Object.keys(node.props).forEach((key) => {
        if (key !== "class") {
          // Исключаем класс из других свойств
          html += ` ${key}="${node.props[key]}"`;
        }
      });
    }
    html += ">";

    if (node.children) {
      node.children.forEach((child: any) => {
        html += this._render(child);
      });
    }

    html += `</${node.type}>`;

    return html;
  }

  public update(parent: any, newVNode: VNode) {
    // const patches = this.diff(this.root, newVNode);
    this.root = newVNode;
    return this.applyPatches(parent);
  }

  public append(parent: VNode, newChild: VNode) {
    // Находим узел родителя и добавляем к его дочерним узлам
    if (parent && this.root) {
      this._findAndAppend(this.root, parent, newChild);
    }
  }

  private _findAndAppend(currentNode: VNode, parent: VNode, newChild: VNode) {
    if (currentNode === parent) {
      currentNode.children.push(newChild);
      return true; // Успешно добавили
    }

    for (const child of currentNode.children) {
      if (this._findAndAppend(child, parent, newChild)) {
        return true; // Успешно добавили в дочернем узле
      }
    }

    return false; // Родитель не найден
  }

  private diff(oldNode: VNode, newNode: VNode): any {
    const patches: any = {};

    // Сравниваем типы узлов
    if (oldNode.type !== newNode.type) {
      patches.type = newNode.type;
      patches.props = newNode.props;
      patches.children = newNode.children;
    } else {
      // Сравниваем свойства
      const propsPatches = this.diffProps(oldNode.props, newNode.props);
      if (Object.keys(propsPatches).length > 0) {
        patches.props = propsPatches;
      }

      // Сравниваем дочерние узлы
      const childrenPatches = this.diffChildren(
        oldNode.children,
        newNode.children,
      );
      if (Object.keys(childrenPatches).length > 0) {
        patches.children = childrenPatches;
      }
    }

    return patches;
  }

  private diffProps(oldProps: any, newProps: any): any {
    const patches: any = {};

    // Сравниваем свойства
    for (const key in newProps) {
      if (oldProps[key] !== newProps[key]) {
        patches[key] = newProps[key];
      }
    }
    // for (const key in oldProps) {
    //   if (!(key in newProps)) {
    //     patches[key] = undefined; // Удаляем свойство
    //   }
    // }

    return patches;
  }

  private diffChildren(oldChildren: VNode[], newChildren: VNode[]): any {
    const patches: any = {};
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
      if (i >= oldChildren.length) {
        // Новый дочерний узел добавлен patches[i] = { type: "ADD", node: newChildren[i] };
      } else if (i >= newChildren.length) {
        // Дочерний узел удален
        patches[i] = { type: "REMOVE", node: oldChildren[i] };
      } else {
        // Сравниваем существующие дочерние узлы
        const childPatches = this.diff(oldChildren[i], newChildren[i]);
        if (Object.keys(childPatches).length > 0) {
          patches[i] = childPatches;
        }
      }
    }

    return patches;
  }

  private applyPatches(parent: any) {
    const html = this.render();
    parent.innerHTML = html;
    return parent;
  }
}