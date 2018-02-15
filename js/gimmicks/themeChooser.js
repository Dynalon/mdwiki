(function($) {
    var tcGimmick = new MDwiki.Gimmick.Gimmick('themechooser');
    var tcHandler = new MDwiki.Gimmick.GimmickHandler('link');
    var tc = new MDwiki.Core.ThemeChooser();

    tc.registerDefaultThemes();

    $.md.wiki.stages.getStage('bootstrap').subscribe(function(done) {
        tc.loadDefaultTheme();
        done();
    });

    tcHandler.callback = function (params, done) {
        tc.enableChooser = true;

        themechooserBuilder(
            params.domElement,
            params.options,
            params.text,
            tc
        );
        done();
    };

    tcGimmick.addHandler(tcHandler);
    $.md.wiki.gimmicks.registerGimmick(tcGimmick);

    // creates the "Select Theme" navbar entry
    var themechooserBuilder = function($elem, opt, text, tc) {
        var isInNav = $elem.parents('.navbar').length > 0;
        var $menu = 
        (isInNav ? $('<li/>') : $('<div/>'))
        .addClass('dropdown')
        .append(
            (isInNav ? $('<a/>') : $('<button/>').addClass('btn btn-primary'))
            .text(text)
            .addClass('dropdown-toggle')
            .attr('type', 'button')
            .attr('href', '#')
            .attr('data-toggle', 'dropdown')
            .append(
                $('<span/>')
                .addClass('caret')
            )
        );

        var $menuContent = $('<ul/>').addClass('dropdown-menu');
        
        $.each(tc.themeNames, function(i, name) {
            $menuContent
            .append(
                $('<li/>')
                .append(
                    $('<a/>')
                    .text(name)
                    .attr('href', '')
                    .click(function(e) {
                        e.preventDefault();
                        tc.currentTheme = name;
                        window.location.reload();
                    })
                )
            );
        });

        $menuContent
        .append([
            $('<li/>')
            .addClass('divider'),
            
            $('<li/>')
            .append(
                $('<a/>')
                .text('Use default')
                .click(function(e) {
                    e.preventDefault();
                    tc.currentTheme = '';
                    window.location.reload();
                })
            ),

            $('<li/>')
            .addClass('divider'),

            $('<li/>')
            .append(
                $('<a/>')
                .text('Powered by Bootswatch')
                .attr('href', 'http://www.bootswatch.com')
            )
        ]);

        $menu.append($menuContent);
        $elem.parent().replaceWith($menu);
    };
}(jQuery));