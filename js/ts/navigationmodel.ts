
module MDwiki.DataModels {

    export class NavigationBarParser {
        parse(node: any): NavigationBarModel {
            var root = $(node);
            var navbar = new NavigationBarModel();

            navbar.pageTitle = root.filter("h1").first().text() || "";

            // TODO fancy selector that selects only p's that aren't
            // followed by <ul>
            root.filter("p").find("a").each(function(i, e) {
                var $el = $(e);
                var toplevelentry = new ToplevelEntry();
                toplevelentry.title = ($el.text());
                toplevelentry.href = ($el.attr("href"));
                navbar.toplevelEntries.push(toplevelentry);
            });

            return navbar;
        }
    }

    export class NavigationBarModel {
        toplevelEntries: any[] = [];
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
