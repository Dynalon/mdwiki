(function($){
    'use strict';
    var pathGimmick = {
        name: 'path',
        once: function() {
            $.md.linkGimmick(this, 'path', pathGimmickFn);
        }
    };
    $.md.registerGimmick(pathGimmick);
 
    function pathGimmickFn($links, opt, href) {
        return $links.each(function(i,link) {
            $(link).replaceWith($.mainHref);
        });
    }
}(jQuery));
