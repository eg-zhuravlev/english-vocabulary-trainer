type ElementAttrs = {
    [key: string]: string;
}

export const createElement = (tag: string, attrs: ElementAttrs, inner?: string, ...children: HTMLElement[]) => {
    let elem = document.createElement(tag);

    if(inner) {
        elem.innerHTML = inner;
    };

    for(let key in attrs) {
        elem.setAttribute(key, attrs[key])
    };

    if(children) {
        for(let i = 0; i < children.length; i++) {
            if (children[i]) {
                elem.appendChild(children[i])
            }
        };
    }

    return elem;
};