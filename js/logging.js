(function($) {
    'use strict';
    $.md.getLogger = function() {

        var loglevel = $.md.loglevel;

        var log = function(logtarget) {
            var self = this;
            var level = loglevel[logtarget];
            return function(msg) {
                if ($.md.logThreshold <= level) {
                    console.log('[' + logtarget + '] ' + msg);
                }
            };
        };

        var logger = {};
        logger.trace = log('TRACE');
        logger.debug = log('DEBUG');
        logger.info = log('INFO');
        logger.warn = log('WARN');
        logger.error = log('ERROR');
        logger.fatal = log('FATAL');

        return logger;
    };
}(jQuery));
