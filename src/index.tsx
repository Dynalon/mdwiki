import { h, render, Component } from "preact";

export class EntryComponent extends Component<{}, {}> {
    render() {
        return <h1>Hello world!</h1>
    }
}
document.addEventListener("DOMContentLoaded", () => {
    render(<EntryComponent />, document.getElementById('root'))
})