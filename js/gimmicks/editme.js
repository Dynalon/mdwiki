(function($){
    'use strict';

    function editMe($links, opt, href) {
        opt.text = opt.text || 'Edit Me';
        if (!href.endsWith('/'))
            href += '/';
        return $links.each(function(i,link) {
            $(link)
                .text(opt.text)
                .attr('href', href + $.md.mainHref)
                .addClass('editme')
                .prepend('<i class="glyphicon glyphicon-pencil"></i> ');
        });
    }
    var editMeGimmick = new MDwiki.Core.Gimmick();
    editMeGimmick.addHandler('editme', editMe);
    $.md.wiki.gimmicks.registerGimmick(editMeGimmick);
}(jQuery));
