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
    $.md.version = '0.1.0';
    $.md.config = {};
    $.md.gimmicks = [];
    $.md.stages = [];
    $.md.mainHref = '';
    $.md.debug = true;

    $.md.loglevel = {
        TRACE: 10,
        DEBUG: 20,
        INFO: 30,
        WARN: 40,
        ERROR: 50,
        FATAL: 60
    };
    $.md.logThreshold = $.md.loglevel.DEBUG;

}(jQuery));
