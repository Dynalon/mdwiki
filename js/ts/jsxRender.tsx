// Tiny JSX renderer in TypeScript inspired by plain-jxs: https://github.com/callumlocke/plain-jsx

//  Babel allows you to specify the factory function as inline comment:
/** @jsx JSXrender */

let JSXrender = (tagName: string, attributes?: { [key: string]: any }, ...children: Array<HTMLElement |  string>): HTMLElement => {

    if (!tagName || typeof tagName !== 'string')
        throw new Error("tagName has to be defined, non-empty string");

    attributes = attributes || {};
    children = children || [];

    let element = document.createElement(tagName);

    for (let attribute_key of Object.keys(attributes)) {
        let attribute_value = attributes[attribute_key];
        element.setAttribute(attribute_key, attribute_value);
    }

    for (let child of children) {
        if (child instanceof HTMLElement)
            element.appendChild(child);
        else if (typeof child === 'string')
            element.appendChild(document.createTextNode(child));
    }

    return element;
}

// Shim as TS does not yet allow custom factory functions besides React
let React = {
    createElement: JSXrender
};

// Test it:
let heading = "Hello world!";
let rendered = <h1>{heading}</h1>

// setTimeout(() => {
//     document.body.appendChild(rendered);
// }, 1500);
