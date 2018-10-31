(function($) {
    'use strict';

    var themeChooserGimmick = {
        name: 'Themes',
        version: $.md.version,
        once: function() {
            $.md.linkGimmick(this, 'carousel', carousel);
        }
    };
    $.md.wiki.gimmicks.registerGimmick(themeChooserGimmick);

    function carousel($link, opt, href) {

        var $c = $('<div id="myCarousel" class="carousel slide"></div>');
        var $d = $('<div class="carousel-inner"/>');
        $c.append('<ol class="carousel-indicators" />');

        var imageUrls = [];
        var i = 0;
        $.each(href.split(','), function(i, e) {
            imageUrls.push($.trim(e));
            $c.find('ol').append('<li data-target="#myCarousel" data-slide-to="' + i + '" class="active" /');
            var div;
            if (i === 0) {
                div = ('<div class="active item"/>');
            } else {
                div = ('<div class="item"/>');
            }
            $d.append($(div).append('<img src="' + e + '"/>'));
        });
        $c.append($d);
        $c.append('<a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>');
        $c.append('<a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>');
        $link.replaceWith($c);
    }
}(jQuery));
