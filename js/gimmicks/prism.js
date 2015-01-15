(function($) {

    var prismGimmick = new MDwiki.Gimmick.Gimmick('prism');
    var prismHandler = new MDwiki.Gimmick.GimmickHandler('multiline');
    prismHandler.loadStage = 'ready';

    var supportedLangs = [
        'bash',
        'c',
        'coffeescript',
        'cpp',
        'csharp',
        'css',
        'go',
        'html',
        'javascript',
        'java',
        'php',
        'python',
        'ruby',
        'sass',
        'sql',
        'xml'
    ];

    prismHandler.callback = function(params, done) {
        var domElement = params.domElement;
        var trigger = params.trigger;
        var text = params.text;

        domElement.addClass("language-csharp");
        done();
    };

    function prism_highlight () {
        // marked adds lang-ruby, lang-csharp etc to the <code> block like in GFM
        var $codeblocks = $('pre code[class^=lang-]');
        $codeblocks.each(function() {
            var $this = $(this);
            var classes = $this.attr('class');
            var lang = classes.substring(5);
            if (supportedLangs.indexOf(lang) < 0) {
                return;
            }
            if (lang === 'html' || lang === 'xml') {
                lang = 'markup';
            }
            $this.removeClass(classes);
            $this.addClass('language-' + lang);
        });
        Prism.highlightAll();
    }

    prismGimmick.addHandler(prismHandler);
    $.md.wiki.gimmicks.registerGimmick(prismGimmick);
    $.md.wiki.stages.getStage('gimmick').subscribe(function(done) {
        Prism.highlightAll();
        done();
    });
}(jQuery));
