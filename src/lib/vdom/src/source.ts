// import { pageContainer } from "../../../index";
// export interface VNode {
//   type: string;
//   props: { [key: string]: any };
//   children: VNode[];
// }

// export class VirtualDOM {
//   private root: VNode;

//   constructor(...args: VNode[]) {
//     if (args.length === 1) {
//       this.root = args[0];
//     } else {
//       this.root = {
//         type: "fragment",
//         props: {},
//         children: args,
//       };
//     }
//   }

//   public render(): string {
//     return this._render(this.root);
//   }
//   private _render(node: VNode): string {
//     if (node.type === "text") {
//       return node.props.text;
//     }
//     if (node.type === "fragment") {
//       let html = "";
//       node.children.forEach((child) => {
//         html += this._render(child);
//       });
//       return html;
//     }
//     let html: string = `<${node.type}`;
//     if (node.props) {
//       // Обработка классов
//       if (node.props.class) {
//         html += ` class="${node.props.class}"`; // Добавляем классы
//       }
//       Object.keys(node.props).forEach((key) => {
//         if (key !== "class") {
//           // Исключаем класс из других свойств
//           html += ` ${key}="${node.props[key]}"`;
//         }
//       });
//     }
//     html += ">";

//     if (node.children) {
//       node.children.forEach((child) => {
//         html += this._render(child);
//       });
//     }

//     html += `</${node.type}>`;

//     return html;
//   }

//   public update(parent: any, newVNode: VNode) {
//     this.root = newVNode; // или другой механизм обновления
//     const html = this.render(); // Получаем HTML
//     const container = parent; // Предположим, что у вас есть элемент с id="app"
//     if (container) {
//       container.innerHTML = html; // Обновляем содержимое контейнера
//     }
//     return container;
//   }
// }

import { pageContainer } from "../../../index";

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
        type: "fragment",
        props: {},
        children: args,
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
    if (node.type === "fragment") {
      let html = "";
      node.children.forEach((child) => {
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
      node.children.forEach((child) => {
        html += this._render(child);
      });
    }

    html += `</${node.type}>`;

    return html;
  }

  public update(parent: any, newVNode: VNode) {
    this.root = newVNode; // или другой механизм обновления
    const html = this.render(); // Получаем HTML
    const container = parent; // Предположим, что у вас есть элемент с id="app"
    if (container) {
      container.innerHTML = html; // Обновляем содержимое контейнера
    }
    return container;
  }
}
