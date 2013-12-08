/// <reference path='stage.ts'/>
/// <reference path='wiki.ts'/>

declare var $: any;

(function($) {

    $.initMDwiki = function (name: string) {

        $.md.wiki = new Wiki();

        $.md.stage = function(name) {
            return $.md.wiki.stages.getStage (name);
        }

    }

}(jQuery));
