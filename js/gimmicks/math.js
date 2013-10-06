(function($) {
    var mathGimmick = {
        name: 'math',
        once: function() {
            $.md.linkGimmick(this, 'math', load_mathjax);
        }
    };
    $.md.registerGimmick(mathGimmick);

    function load_mathjax($links, opt, ref) {
        $links.remove();
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src  = '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
        document.getElementsByTagName('head')[0].appendChild(script);
    }

}(jQuery));
