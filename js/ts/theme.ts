module MDwiki.Core {
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
        private baseUrl: string =  '//netdna.bootstrapcdn.com/bootswatch/3.0.2/'
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
        public enableChooser: boolean = false;

        public get themeNames (): string[] {
            return this.themes.map(t => t.name);
        }

        public get currentTheme (): string {
            var theme = window.localStorage.getItem("theme");
            return theme;
        }
        public set currentTheme (val: string) {
            if (val == '')
                window.localStorage.removeItem("theme");
            else
                window.localStorage.setItem("theme", val);
        }

        // registers a theme into the catalog
        public register (theme: Theme): void {
            this.themes.push(theme);
        }
        public loadDefaultTheme (): void {
            this.load(this.currentTheme);
            // TODO load a default theme - right now this is baked in the index.tmpl
        }

        public load (name: string): void {
            var target = this.themes.filter(t => t.name == name);
            if (target.length <= 0) return;
            else this.applyTheme(target[0]);
        }

        private applyTheme (theme: Theme): void {

            $('link[rel=stylesheet][href*="netdna.bootstrapcdn.com"]').remove();
            var link_tag = this.createLinkTag(theme.styles[0]);
            $('head').append(link_tag);
        }

        private createLinkTag (url: string) {
            return $('<link rel="stylesheet" type="text/css">').attr('href', url);
        }
    }
/*
    export class ThemeChooserGimmick extends Gimmick {
        constructor() {
            super();
            var tc = new ThemeChooser ();
            registerDefaultThemes(tc);

            $.md.stage('bootstrap').subscribe(function(done) {
                tc.loadDefaultTheme();
                done();
            });

            var build_chooser = ($links, opt, text) => {
                tc.enableChooser = true;
                themechooser($links, opt, text, tc);
            };
            var apply_theme = ($links, opt, text) => {
                set_theme($links, opt, text, tc);
            }

            this.addHandler('themechooser', build_chooser, 'skel_ready');
            this.addHandler('theme', apply_theme);

        }
    };
*/
    var set_theme = function($links, opt, text, tc: ThemeChooser) {
        opt.name = opt.name || text;
        $links.each(function (i, link) {
            $.md.stage('postgimmick').subscribe(function(done) {
                if (!tc.currentTheme ||  tc.currentTheme == '' || tc.enableChooser == false)
                    tc.load(opt.name);
                done();
            });
        });
        $links.remove();
    };

    function registerDefaultThemes(tc: ThemeChooser) {
        var bootswatch_theme_names : string[] = [
            'amelia', 'cerulean', 'cosmo', 'cyborg', 'flatly', 'journal',
            'readable','simplex','slate','spacelab','united', 'yeti'
        ];
        bootswatch_theme_names.map(name => tc.register(new BootswatchTheme (name)));
    }

    // creates the "Select Theme" navbar entry
    var themechooser = function($links, opt, text, tc: ThemeChooser) {
        return $links.each(function(i, e) {
            var $this = $(e);
            var $chooser = $('<a href=""></a><ul></ul>'
            );
            $chooser.eq(0).text(text);

            $.each(tc.themeNames, function(i: number, themeName: string) {
                var $li = $('<li></li>');
                $chooser.eq(1).append($li);
                var $a = $('<a/>')
                    .text(themeName)
                    .attr('href', '')
                    .click(function(ev) {
                        ev.preventDefault();
                        tc.currentTheme = themeName;
                        window.location.reload();
                    })
                    .appendTo($li);
            });

            $chooser.eq(1).append('<li class="divider" />');
            var $li = $('<li/>');
            var $a_use_default = $('<a>Use default</a>');
            $a_use_default.click(function(ev) {
                ev.preventDefault();
                tc.currentTheme = '';
                window.location.reload();
            });
            $li.append($a_use_default);
            $chooser.eq(1).append($li);

            $chooser.eq(1).append('<li class="divider" />');
            $chooser.eq(1).append('<li><a href="https://www.bootswatch.com">Powered by Bootswatch</a></li>');
            $this.replaceWith($chooser);
        });
    };
}
