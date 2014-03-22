(function($) {
    //'use strict';
    function twitterfollow($links, opt, text) {
        return $links.each(function(i, link) {
            var $link = $(link);
            var user;
            var href = $link.attr('href');
            if (href.indexOf ('twitter.com') <= 0) {
                user = $link.attr('href');
                href = $.md.prepareLink('twitter.com/' + user);
            }
            else {
                return;
            }
            // remove the leading @ if given
            if (user[0] === '@') {
                user = user.substring(1);
            }
            var twitter_src = $('<a href="' + href + '" class="twitter-follow-button" data-show-count="false" data-lang="en" data-show-screen-name="false">'+ '@' + user + '</a>');
            $link.replaceWith (twitter_src);
        });
    }

    // no license information given in the widget.js -> OTHER
    var widgetHref = $.md.prepareLink('platform.twitter.com/widgets.js');
    var twitterscript = '!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="' + widgetHref + '";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");';

    var twitterGimmick = new MDwiki.Core.Gimmick();
    twitterGimmick.addHandler('twitterfollow', twitterfollow);
    twitterGimmick.init = function() {
        var script = new MDwiki.Core.ScriptResource();
        script.url = twitterscript;
        script.loadstage = 'postgimmick';
        script.finishstage = 'all_ready';
                // license: 'EXCEPTION',
        twitterGimmick.registerScriptResource(script);
    };
    $.md.wiki.gimmicks.registerGimmick(twitterGimmick);

}(jQuery));
