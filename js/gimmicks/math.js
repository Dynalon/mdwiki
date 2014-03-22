(function($) {

    function load_mathjax($links, opt, ref) {
        $links.remove();
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src  = $.md.prepareLink('cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML', { forceHTTP: true });
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    var mathGimmick = new MDwiki.Core.Gimmick();
    mathGimmick.addHandler('math', load_mathjax);
    $.md.wiki.gimmicks.registerGimmick(mathGimmick);

}(jQuery));
