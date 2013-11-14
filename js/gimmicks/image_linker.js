(function($) {
    var methods = {
        // takes a standard <img> tag and adds a hyperlink to the image source
        // needed since we scale down images via css and want them to be accessible
        // in original format
        image_linker: function() {
            function selectNonLinkedImages () {
                // only highliht images that do not have a non-empty parent link
                $images = $('img').filter(function(index) {
                    var $parent_link = $(this).parents('a').eq(0);
                    var attr = $parent_link.attr('href');
                    return attr && attr.length > 0;
                });
                return $images;
            }
            var $images = selectNonLinkedImages ();
            return $images.each(function() {
                var $this = $(this);
                var img_src = $this.attr('src');
                var img_title = $this.attr('title');
                if (img_title === undefined) {
                    img_title = '';
                }
                // wrap the <img> tag in an anchor and copy the title of the image
                $this.wrap('<a href="' + img_src + '" title="'+ img_title +'"/> ');
            });
        }
    };
    $.gimmicks.methods = $.extend({}, $.fn.gimmicks.methods, methods);

}(jQuery));
