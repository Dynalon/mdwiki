/* # FEED GIMMICK
 *
 * Creates a list containing feed elements (through [Google Feed API][GOOGLE_FEED]).
 *
 * The list may be used as submenu items in the [navigation][NAVIGATION] bar.
 *
 * ## Usage
 *
 *     [gimmick:feed](https://github.com/blog.atom)
 *
 *     [gimmick:feed (max: 4)](https://www.reddit.com/r/programming/.rss)
 *
 *     [gimmick:feed (showArticle: true, maxChars: 256)](http://rss.slashdot.org/Slashdot/slashdotMain)
 *
 *     [gimmick:feed (showArticle: true, raw: true)](https://guillermocalvo.github.io/feed/quotes.xml)
 *
 * ## Options
 *
 *  * **max**:          Maximum number of feed elements to load.
 *  * **showArticle**:  If `true` the content of the feed element will be shown too.
 *  * **maxChars**:     Truncates the content up to a number of characters.
 *  * **raw**:          If `true` the content will be shown as-is (HTML tags will not be stripped).
 *  * **target**:       Specifies Where to open the linked article.
 *  * **loading**:      Specifies the message that will appear while the list is being loaded.
 *  * **cssClass**:     Specifies the CSS class of the list.
 *
 * ## Author
 *
 * Copyright 2015 Guillermo Calvo
 *
 * <https://github.com/guillermocalvo/>
 *
 * [GOOGLE_FEED]: https://developers.google.com/feed/v1/reference
 * [NAVIGATION]: http://dynalon.github.io/mdwiki/#!quickstart.md#Adding_a_navigation
 */
(function($){
    'use strict';
    function feed($link, opt, text){
        var default_options = {
            max:         10,
            showArticle: false,
            raw:         false,
            maxChars:    140,
            target:      '_blank',
            loading:     'Loading\u2026',
            cssClass:    'feed-gimmick'
        };
        var options   = $.extend({}, default_options, opt);
        var url       = text;
        var feedId    = 'FEED_' + Math.random().toString(36).substr(2);
        var loadItems = function(data){
            var html = '';
            if(data.responseData){
                $.each(data.responseData.feed.entries, function(index, value){
                    var article = '';
                    if(options.showArticle && value.content){
                        article = value.content;
                        if(!options.raw){
                            article = article.replace(/<(?:.|\n)*?>/gm, '').replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
                            if(options.maxChars > 0 && article.length > options.maxChars){
                                article = article.substr(0, options.maxChars) + '\u2026';
                            }
                        }
                        article = '<article>' + article + '</article>';
                    }
                    html += '<li><a target="' + options.target + '" href="' + value.link + '">' + value.title + '</a>' + article + '</li>';
                });
            }else{
                html = '<li class="alert-warning"><a href="' + url + '">' + data.responseDetails + '</a></li>';
            }
            $('#' + feedId).empty().append(html);
        };
        return $link.each(function(i,e){

            $(e).replaceWith('<ul id="' + feedId + '" class="' + options.cssClass + '"><li><a href="">' + options.loading + '</a></li></ul>');

            $.ajax( { 'url': 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json&callback=?&q=' + encodeURIComponent(url) + '&num=' + options.max, 'dataType': 'json', 'success': loadItems } );
        });
    }

    var gimmick = new MDwiki.Core.Gimmick();
    gimmick.addHandler('feed', feed);
    $.md.wiki.gimmicks.registerGimmick(gimmick);

}(jQuery));
