// Tiny JSX renderer in TypeScript inspired by plain-jxs: https://github.com/callumlocke/plain-jsx

//  Babel allows you to specify the factory function as inline comment:
/** @jsx JSXrender */

class JsxRender {

    public createElement = (tagName: string, attributes?: { [key: string]: any }, ...children: Array<HTMLElement |  string>): HTMLElement => {

        if (!tagName || typeof tagName !== 'string')
            throw new Error("tagName has to be defined, non-empty string");

        attributes = attributes || {};
        children = children || [];

        let element = document.createElement(tagName);

        for (let attribute_key of Object.keys(attributes)) {
            let attribute_value = attributes[attribute_key];
            element.setAttribute(attribute_key, attribute_value);
        }

        for (let child of children)
            this.appendChild(element, child);

        return element;
    }

    public __spread () {
        throw "__spread not yet implemented!";
    }

    private appendChild = (element: HTMLElement, child: string | HTMLElement | Array<string | HTMLElement>) => {
        if (child instanceof HTMLElement)
            element.appendChild(child);
        else if (typeof child === 'string')
            element.appendChild(document.createTextNode(child));
        else if (child instanceof Array) {
            for (let subchild of child) {
                this.appendChild(element, subchild);
            }
        }
    }
}
(window as any).JsxRender = new JsxRender();

// Test it:
let heading = "Hello world!";
let arr = [1, 2, 3];

let rendered =
    <div>
        <h1>{heading}</h1>
        {['foo', 'bar'].map(i => <h1>{i}</h1>) }
    </div>

// setTimeout(() => {
//     document.body.appendChild(rendered);
// }, 1500);
