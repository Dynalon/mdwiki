/* # YUML GIMMICK
 *
 * Create diagrams in no time with [yUML][yUML].
 *
 * ## Usage
 *
 *     [gimmick:yuml]( [HttpContext]uses -.->[Response] )
 *
 *     [gimmick:yuml (style: 'scruffy', dir: 'TB') ]( [Customer]->[Billing Address] )
 *
 *     [gimmick:yuml (diag: 'activity', style: 'plain') ]( `Make Coffee´->`want more coffee´ )
 *
 *     [gimmick:yuml (diag: 'usecase', scale: 200) ]( [Customer]-`Sign In´, [Customer]-`Buy Products´ )
 *
 * ## Options
 *
 *  * **diag**: `class`, `activity`, `usecase`
 *  * **style**: `plain`, `scruffy`
 *  * **dir**: `LR`, `TB`, `RL`
 *  * **scale**: number (original size: 100)
 *
 * ## Author
 *
 * Copyright 2014 Guillermo Calvo
 *
 * <https://github.com/guillermocalvo/>
 *
 * ## License
 *
 * Licensed under the [GNU Lesser General Public License][LGPL].
 *
 * [yUML]: http://www.yuml.me/
 * [LGPL]: http://www.gnu.org/copyleft/lesser.html
 */
(function($) {
    'use strict';
    function yuml($link, opt, text) {
        var default_options = {
            type: 'class',  /* { class, activity, usecase } */
            style: 'plain', /* { plain, scruffy } */
            direction: 'LR',      /* LR, TB, RL */
            scale: '100'
        };
        var options = $.extend ({}, default_options, opt);

        return $link.each(function(i,e) {

            var $this = $(e);
            var url = 'http://yuml.me/diagram/';
            var data = $this.attr('href');
            var title = $this.attr('title');

            title = (title ? title : '');

            /* `FOOBAR´ => (FOOBAR) */
            data = data.replace( new RegExp('`', 'g'), '(' ).replace( new RegExp('´', 'g'), ')' );

            url += options.style + ';dir:' + options.direction + ';scale:' + options.scale + '/' + options.type + '/' + data;

            var $img = $('<img src="' + url + '" title="' + title + '" alt="' + title + '">');

            $this.replaceWith($img);
        });
    }

    var gimmick = new MDwiki.Core.Gimmick();
    gimmick.addHandler('yuml', yuml);
    $.md.wiki.gimmicks.registerGimmick(gimmick);

}(jQuery));
