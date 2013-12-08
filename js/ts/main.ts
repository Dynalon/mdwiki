declare var $: any;


(function($) {

    $.initMDwiki = function (name: string) {

        $.md.wiki = new MDwiki.Core.Wiki();
        $.md.stage = function(name) {
            return $.md.wiki.stages.getStage (name);
        }
    }

}(jQuery));
