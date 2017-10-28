import { h, render, Component } from "preact";
import { HtmlRenderer, Parser } from "commonmark";


interface IProps {
}

interface IState {
    html: string;
}

class EntryComponent extends Component<{}, IState> {
    private renderArea: Element;

    componentDidMount() {
        fetch('sample.md').then((resp) => {
            resp.text().then(text => {
                const div = markdownToDiv(text);
                this.renderArea.appendChild(div);
            })
        })
    }
    render() {
        return (<div ref={(self) => this.renderArea = self}></div>);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    render(<EntryComponent />, document.getElementById('root'))
})

function markdownToDiv(markdown: string): HTMLDivElement {
    const div = document.createElement("div");
    div.setAttribute("data-markdown-root", "")
    const parsed = new Parser().parse(markdown);

    const rendered = new HtmlRenderer().render(parsed);
    div.innerHTML = rendered;

    return div;
}