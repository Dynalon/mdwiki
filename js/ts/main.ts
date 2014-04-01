declare var MDwikiEnableDebug: any;

(function($) {

    var logger;
    if (typeof(MDwikiEnableDebug) != "undefined")
        logger = new MDwiki.Util.Logger(MDwiki.Util.LogLevel.DEBUG);
    else
        logger = new MDwiki.Util.Logger(MDwiki.Util.LogLevel.ERROR);

    $.md.getLogger = function() {
        return logger;
    };

    $.initMDwiki = function (name: string) {

        $.md.wiki = new MDwiki.Core.Wiki();
        $.md.stage = function(name) {
            return $.md.wiki.stages.getStage (name);
        }
    }

}(jQuery));
