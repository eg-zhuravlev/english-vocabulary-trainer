type ElementAttrs = {
  [key: string]: string;
};

type CreateElementOptions = {
  attrs?: ElementAttrs;
  inner?: string;
  children?: HTMLElement[];
};

export const createElement = (tag: string, options: CreateElementOptions) => {
  const { attrs, inner, children } = options;
  const elem = document.createElement(tag);

  if (inner) {
    elem.innerHTML = inner;
  }

  for (let key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }

  if (children) {
    for (let i = 0; i < children.length; i++) {
      if (children[i]) {
        elem.appendChild(children[i]);
      }
    }
  }

  return elem;
};
