(function($) {
    $.gimmicks = $.fn.gimmicks = function(method) {
        if (method === undefined) {
            return;
        }
        // call the gimmick
        if ($.fn.gimmicks.methods[method]) {
            return $.fn.gimmicks.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error('Gimmick ' + method + ' does not exist on jQuery.gimmicks');
        }
    };

    // TODO underscores _ in Markdown links are not allowed! bug in our MD imlemenation


}(jQuery));
