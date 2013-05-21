(function($) {
    'use strict';

    // register our $.md object
    $.md = function (method){
        if ($.md.publicMethods[method]) {
            return $.md.publicMethods[method].apply(this,
                Array.prototype.slice.call(arguments, 1)
            );
        } else {
            $.error('Method ' + method + ' does not exist on jquery.md');
        }
    };
    $.md.version = "0.1.0";
    $.md.config = {};
    $.md.gimmicks = [];
    $.md.stages = [];
    $.md.mainHref = '';

}(jQuery));
