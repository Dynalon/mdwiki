(function($) {
    var methods = {
        // takes a standard <img> tag and adds a hyperlink to the image source
        // needed since we scale down images via css and want them to be accessible
        // in original format
        image_linker: function() {
            var $images;
            if (!(this instanceof jQuery)) {
                $images = $('img').filter(function(index) {
                    return $(this).parents('a').length === 0;
                });
            } else {
                $images = $(this);
            }
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
