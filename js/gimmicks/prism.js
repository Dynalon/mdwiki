(function($) {

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

    var prismGimmick = new MDwiki.Core.Module();
    prismGimmick.init = function() {
        $.md.stage('gimmick').subscribe(function(done) {
            prism_highlight();
            done();
        });
    };
    $.md.wiki.gimmicks.registerModule(prismGimmick);
}(jQuery));
