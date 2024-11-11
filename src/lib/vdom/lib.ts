import { Virtual } from "../../index";
import { VirtualDOM } from "./src/source";
import { VNode } from "./src/source";
/**
 * Создание элемента
 * @param type Тип
 * @param props Свойства
 * @param children Дети
 * @returns
 */
function createElement(
  type: string,
  props: { [key: string]: any },
  children: (VNode | string)[]
): VNode {
  const vdomChildren = children.map(child => 
    typeof child === 'string' ? createText(child) : child
  );
  return { type, props, children: vdomChildren };
}
// function createElement(
//   type: string,
//   props: { class?: string; style?: string; children?: any }, // Add style if needed
//   children: (VNode | string)[]
// ): VNode {
//   const vdomChildren = children.map(child => 
//       typeof child === 'string' ? createText(child) : child
//   );
//   return { type, props: { ...props, children: vdomChildren }, children: vdomChildren };
// }
/**
 * Создание текста
 * @param text Текст
 * @returns
 */
function createText(text: string): VNode {
  return { type: "text", props: { text }, children: [] };
}

/**
 * Рендер виртуального дома
 * @param vdom
 * @returns
 */
function render(vdom: VirtualDOM): any {
  return vdom.render();
}
/**
 * Функция обновление контейнера
 * @param parent Родитель
 * @param content То, что хотим внести в родителя
 * @param vdom Переменная виртуального дома
 * @returns
 */
function update(parent: any, content: VNode, vdom: VirtualDOM = Virtual): any {
  return vdom.update(parent, content);
}

/**
 * Функция вставки в родителя
 * @param parent Родитель
 * @param newChild Новый контейнер, который хотим присоеденить в родителя
 * @param vdom Виртуальный дом
 * @returns
 */
function append(
  parent: VNode,
  newChild: VNode,
  vdom: VirtualDOM = Virtual,
): any {
  return vdom.append(parent, newChild);
}
export { createElement, createText, render, update, append };
export const Fragment = ({ children }: { children: (VNode | string)[] }) => {
  return createElement("div", {}, children); // Создаем div, который будет содержать дочерние элементы
};