(function($) {
    var methods = {
        youtube: function() {
            var $youtube_links;
            if (!(this instanceof jQuery)) {
                $youtube_links = $('a[href*=youtube\\.com]:empty, a[href*=youtu\\.be]:empty');
            }
            return $youtube_links.each(function() {
                var $this = $(this);
                var href = $this.attr('href');
                if (href !== undefined) {
                    // extract the v parameter from youtube
                    var exp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
                    var m = href.match(exp);

                    if (m && m[1].length === 11) {
                        // insert the iframe
                        var short_handle = m[1];
                        var frame = $('<iframe class="md-external" frameborder="0" allowfullscreen></iframe>');
                        frame.attr('src', 'http://youtube.com/embed/' + short_handle);
                        // remove the a tag
                        $this.replaceWith(frame);

                    }
                }
            });
        }
    };
    $.gimmicks.methods = $.fn.gimmicks.methods = $.extend({}, $.fn.gimmicks.methods, methods);
}(jQuery));
