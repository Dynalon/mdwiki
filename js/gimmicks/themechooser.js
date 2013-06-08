(function($) {
    'use strict';

    var themes = [
        { name: 'bootstrap', url: '//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css' },
        { name: 'amelia', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/amelia/bootstrap.min.css' },
        { name: 'cerulean', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/cerulean/bootstrap.min.css' },
        { name: 'cosmo', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/cosmo/bootstrap.min.css' },
        { name: 'cyborg', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/cyborg/bootstrap.min.css' },
        { name: 'flatly', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/flatly/bootstrap.min.css' },
        { name: 'journal', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/journal/bootstrap.min.css' },
        { name: 'readable', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/readable/bootstrap.min.css' },
        { name: 'simplex', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/simplex/bootstrap.min.css' },
        { name: 'slate', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/slate/bootstrap.min.css' },
        { name: 'spacelab', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/spacelab/bootstrap.min.css' },
        { name: 'spruce', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/spruce/bootstrap.min.css' },
        { name: 'superhero', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/superhero/bootstrap.min.css' },
        { name: 'united', url: '//netdna.bootstrapcdn.com/bootswatch/2.3.2/united/bootstrap.min.css' }
    ];
    var themeChooserGimmick = {
        name: 'Themes',
        version: $.md.version,
        once: function() {
            $.md.linkGimmick(this, 'themechooser', themechooser, 'skel_ready');
            $.md.linkGimmick(this, 'theme', apply_theme);

            $.md.stage('bootstrap').subscribe(function(done) {
                restore_theme();
                done();
            });
        }
    };
    $.md.registerGimmick(themeChooserGimmick);

    var log = $.md.getLogger();

    var set_theme = function(theme) {
        if (theme.url === undefined) {
            if (!theme.name) {
                log.error('Theme name must be given!');
                return;
            }
            theme = themes.filter(function(t) {
                return t.name === theme.name;
            })[0];
            if (!theme) {
                log.error('Theme ' + name + ' not found, removing link');
                return;
            }
        }

        // in devel & fat version the style is inlined, remove it
        $('style[id*=bootstrap]').remove();

        $('link[rel=stylesheet][href*="netdna.bootstrapcdn.com"]')
            .remove();

        $('<link rel="stylesheet" type="text/css">')
            .attr('href', theme.url)
            .appendTo('head');
    };

    var apply_theme = function($links, opt, text) {
        return $links.each(function(i, link) {
            $.md.stage('postgimmick').subscribe(function(done) {
                var $link = $(link);
                set_theme(opt);
                $link.remove();
                done();
            });
        });
    };

    var themechooser = function($links, opt, text) {
        return $links.each(function(i, e) {
            var $this = $(e);
            var $chooser = $('<a href=""></a><ul></ul>'
            );
            $chooser.eq(0).text(text);

            $.each(themes, function(i, theme) {
                var $li = $('<li></li>');
                $chooser.eq(1).append($li);
                var $a = $('<a/>')
                    .text(theme.name)
                    .attr('href', 'fpp')
                    .click(function(ev) {
                        ev.preventDefault();
                        window.localStorage.theme = theme.name;
                        window.location.reload();
                    })
                    .appendTo($li);
            });
            $chooser.eq(1).append('<li class="divider" /:>');
            $chooser.eq(1).append('<li><a href="http://www.bootswatch.com">Powered by Bootswatch</a></li>');
            $this.replaceWith($chooser);
        });
    };

    var restore_theme = function() {
        if (window.localStorage.theme) {
            set_theme({ name: window.localStorage.theme });
        }
    };
}(jQuery));
