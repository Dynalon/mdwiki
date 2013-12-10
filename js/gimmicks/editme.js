(function($){
    'use strict';
    var editMeGimmick = {
        name: 'editme',
        version: $.md.version,
        once: function() {
            $.md.linkGimmick(this, 'editme', editMe);
        }
    };
    $.md.registerGimmick(editMeGimmick);
 
    function editMe($links, opt, href) {
        opt.text = opt.text || 'Edit Me';
        return $links.each(function(i,link) {
            $(link)
                .text(opt.text)
                .attr('href', href + $.md.mainHref)
                .addClass('editme')
                .prepend('<i class="glyphicon glyphicon-pencil"></i> ');
        });
    }
}(jQuery));
