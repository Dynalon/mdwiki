(function($) {
    // makes trouble, find out why
    //'use strict';
    var colorboxModule = new MDwiki.Core.Module();
    colorboxModule.init = function() {
        $.md.stage('gimmick').subscribe(function(done) {
            make_colorbox();
            done();
        });
    };
    $.md.wiki.gimmicks.registerModule(colorboxModule);

    function make_colorbox() {
        var $image_groups;
        if (!(this instanceof jQuery)) {
            // select the image groups of the page
            $image_groups = $('.md-image-group');
        } else {
            $image_groups = $(this);
        }
        // operate on md-image-group, which holds one
        // or more images that are to be colorbox'ed
        var counter = 0;
        return $image_groups.each(function() {
            var $this = $(this);

            // each group requires a unique name
            var gal_group = 'gallery-group-' + (counter++);

            // create a hyperlink around the image
            $this.find('a.md-image-selfref img')
            // filter out images that already are a hyperlink
            // (so won't be part of the gallery)

            // apply colorbox on their parent anchors
            .parents('a').colorbox({
                rel: gal_group,
                opacity: 0.75,
                slideshow: true,
                maxWidth: '95%',
                maxHeight: '95%',
                scalePhotos: true,
                photo: true,
                slideshowAuto: false
            });
        });
    }
}(jQuery));
