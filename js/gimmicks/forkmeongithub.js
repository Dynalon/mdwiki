(function($) {
    'use strict';
    function forkmeongithub($links, opt, text) {
        return $links.each (function (i, link){
            var $link = $(link);
            // default options
            var default_options = {
                color: 'red',
                position : 'right'
            };
            var options = $.extend ({}, default_options, opt);
            var color = options.color;
            var pos = options.position;

            // the filename for the ribbon
            // see: https://github.com/blog/273-github-ribbons
            var base_href = 'https://s3.amazonaws.com/github/ribbons/forkme_';

            if (color === 'red') {
                base_href += pos + '_red_aa0000.png';
            }
            if (color === 'green') {
                base_href += pos + '_green_007200.png';
            }
            if (color === 'darkblue') {
                base_href += pos + '_darkblue_121621.png';
            }
            if (color === 'orange') {
                base_href += pos + '_orange_ff7600.png';
            }
            if (color === 'white') {
                base_href += pos + '_white_ffffff.png';
            }
            if (color === 'gray') {
                base_href += pos + '_gray_6d6d6d.png';
            }

            var href = $link.attr('href');
    //                var body_pos_top = $('#md-body').offset ().top;
            var body_pos_top = 0;
            var github_link = $('<a class="forkmeongithub" href="'+ href +'"><img style="position: absolute; top: ' + body_pos_top + ';'+pos+': 0; border: 0;" src="'+base_href+'" alt="Fork me on GitHub"></a>');
            // to avoid interfering with other div / scripts, we remove the link and prepend it to the body
            // the fork me ribbon is positioned absolute anyways
            $('body').prepend (github_link);
            github_link.find('img').css ('z-index', '2000');
            $link.remove();
        });
    }

    var gimmick = new MDwiki.Core.Gimmick();
    gimmick.addHandler('forkmeongithub', forkmeongithub);
    $.md.wiki.gimmicks.registerGimmick(gimmick);

}(jQuery));
