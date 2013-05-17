(function($) {
    var publicMethods = {
        isRelativeUrl: function(url) {
            if (url === undefined) {
                return false;
            }
            // if there is :// in it, its considered absolute
            // else its relative
            if (url.indexOf('://') === -1) {
                return true;
            } else {
                return false;
            }
        },
        wait: function(time) {
            return $.Deferred(function(dfd) {
                setTimeout(dfd.resolve, time);
            });
        }
    };
    $.md.util = $.extend ({}, $.md.util, publicMethods);
}(jQuery));
