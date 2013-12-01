/// <reference path="./d.ts/DefinitelyTyped/jquery/jquery.d.ts" />

class StringUtil {
    static startsWith (search: string, suffix: string) {
        return search.slice(0, suffix.length) == suffix;
    }
    static endsWith (search: string, prefix: string) : boolean {
        return search.slice(search.length - prefix.length, search.length) == prefix;
    }
}

class Theme {
    public name: string;
    public styles: string[];
    public scripts: string[];

    constructor(name: string, styles: string[], scripts: string[] = []) {
        this.name = name;
        this.styles = styles;
        this.scripts = scripts;
    }
    public onLoad() {
    }
}

class BootswatchTheme extends Theme {
    private baseUrl: string =  '//netdna.bootstrapcdn.com/bootswatch/3.0.0/'
    private baseFilename: string = '/bootstrap.min.css';
    private get url() {
        return this.baseUrl + this.name + this.baseFilename;
    }

    constructor (name: string) {
        super(name, [], []);
        this.styles = [ this.url ];
    }
}


class ThemeChooser {
    private themes: Theme[] = [];

    private get currentTheme (): string {
        var theme = window.localStorage.getItem("theme");
        return theme;
    }
    private set currentTheme (val: string) {
        window.localStorage.setItem("theme", val);
    }

    // registers the theme into the catalog
    register (theme: Theme) {
        this.themes.push(theme);
    }

    // loads a theme
    load (name: string) {
        var target = this.themes.filter(x => {
            return x.name == name;
        })[0];
        this.applyTheme(target);
    }
    loadDefaultTheme () {
        this.load (this.currentTheme);
    }

    private applyTheme (theme: Theme) {

        $('link[rel=stylesheet][href*="netdna.bootstrapcdn.com"]').remove();
        var link_tag = this.createLinkTag(theme.styles[0]);
        $('head').append(link_tag);
        this.currentTheme = theme.name;
    }

    private createLinkTag (url: string) {
        return $('<link rel="stylesheet" type="text/css">').attr('href', url);
    }
}

// TODO this should go into a gimmick
var tc = new ThemeChooser ();

var bootstrap = new Theme('bootstrap', ['netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css']);
tc.register(bootstrap)

var spacelab = new BootswatchTheme('simplex');
var bootswatch_themes : string[] = [ 'amelia', 'cerulean', 'cosmo', 'cyborg', 'flatly', 'journal',
    'readable','simplex','slate','spacelab','united' ];

bootswatch_themes.map(name => tc.register(new BootswatchTheme (name)));


tc.loadDefaultTheme();

