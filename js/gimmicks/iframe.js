(function($) {
    'use strict';

    function create_iframe($links, opt, text) {
        return $links.each (function (i, link){
            var $link = $(link);
            var href = $link.attr('href');
            var $iframe = $('<iframe class="col-md-12" style="border: 0px solid red; height: 650px;"></iframe>');
            $iframe.attr('src', href);
            $link.replaceWith($iframe);

            if (opt.width)
                $iframe.css('width', opt.width);
            if (opt.height)
                $iframe.css('height', opt.height);
            else {
                var updateSizeFn = function () {
                    var offset = $iframe.offset();
                    var winHeight = $(window).height();
                    var newHeight = winHeight - offset.top - 5;
                    $iframe.height(newHeight);
                };

                $iframe.load(function(done) {
                    updateSizeFn();
                });

                $(window).resize(function () {
                    updateSizeFn();
                });
            }

        });
    }

    var iframeGimmick = new MDwiki.Core.Gimmick();
    iframeGimmick.addHandler('iframe', create_iframe);
    $.md.wiki.gimmicks.registerGimmick(iframeGimmick);
}(jQuery));
