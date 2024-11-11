export interface VNode {
    type: string;
    props: { [key: string]: any }; 
    children: (VNode | string)[];
}

export function createElement(
    type: string,
    props: { [key: string]: any },
    ...children: (VNode | string)[]
): VNode {
    const vdomChildren = children.map(child => 
        typeof child === 'string' ? createText(child) : child
    );
    return { type, props: { ...props, children: vdomChildren }, children: vdomChildren };
}

export const Fragment = ({ children }: { children: (VNode | string)[] }) => {
    return createElement("div", {}, ...children); 
};

export function createText(text: string): VNode {
    return { type: "text", props: { text }, children: [] };
}