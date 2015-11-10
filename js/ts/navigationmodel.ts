
module MDwiki.DataModels {

    export class NavigationBarParser {
        private navbar;
        private node: any;

        constructor (node: any) {
            this.node = $(node);
            this.navbar = new NavigationBarModel();
        }

        parse(): NavigationBarModel {
            this.findPageTitle();
            this.findTopLevelEntries();

            return this.navbar;
        }

        private findPageTitle () {
            this.navbar.pageTitle = this.node.filter("h1").first().text() || "";
        }

        private findTopLevelEntries () {
            // TODO fancy selector that selects only p's that aren't
            // followed by <ul>
            this.node.filter("p").find("a").each((i, e) => {
                let $el = $(e);
                let toplevelentry = new ToplevelEntry();
                toplevelentry.title = $el.text();
                toplevelentry.href = $el.attr("href");
                this.navbar.toplevelEntries.push(toplevelentry);
            });
        }
    }

    export class NavigationBarModel {
        toplevelEntries: ToplevelEntry[] = [];
        pageTitle: string = "";
    }

    export class ToplevelEntry
    {
        title: string = "";
        href: string = "";
        childs: SublevelEntry[] = [];
    }

    export class SublevelEntry
    {
        title: string = "";
        href: string = "";
        seperator: boolean = false;
    }

    function buildSampleMenu() {
        var navbar = new NavigationBarModel();
        var t1 = new ToplevelEntry();
        t1.title = "About";
        t1.href = "index.md";
        var t2 = new ToplevelEntry();
        t2.title = "Docs";
        t2.href = "";

        var s1 = new SublevelEntry();
        s1.title = "Quickstart";
        s1.href = "quickstart.md";
        t2.childs.push(s1);

        var s2 = new SublevelEntry();
        s2.title = "Quickstart";
        s2.href = "quickstart.md";
        t2.childs.push(s2);

        navbar.toplevelEntries.push(t1);
        navbar.toplevelEntries.push(t2);
    }
}
