(function($) {
    var methods = {
        disqus: function(opt) {
            var default_options = {
                identifier: ''
            };
            var options = $.extend (default_options, opt);
            var disqus_div = $('<div id="disqus_thread" class="md-external md-external-noheight md-external-nowidth" >' + '<a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a></div>');
            disqus_div.css ('margin-top', '2em');
            return $(this).each(function() {
                var $this = $(this);
                var disqus_shortname = $this.attr('href');

                if (disqus_shortname !== undefined && disqus_shortname.length > 0) {
                    // insert the div
                    $this.remove ();
                    // since disqus need lot of height, always but it on the bottom of the page
                    $('#md-content').append(disqus_div);
                    if ($('#disqus_thread').length > 0) {
                        (function() {
                            // all disqus_ variables are used by the script, they
                            // change the config behavious.
                            // see: http://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables

                            // set to 1 if developing, or the site is password protected or not
                            // publicaly accessible
                            //var disqus_developer = 1;

                            // by default, disqus will use the current url to determine a thread
                            // since we might have different parameters present, we remove them
                            // disqus_* vars HAVE TO BE IN GLOBAL SCOPE
                            var disqus_url = remove_underscore_parameters (window.location.href);
                            var disqus_identifier;
                            if (options.identifier.length > 0) {
                                disqus_identifier = options.identifier;
                            } else {
                                disqus_identifier = disqus_url;
                            }

                            // dynamically load the disqus script
                            var dsq = document.createElement('script');
                            dsq.type = 'text/javascript';
                            dsq.async = true;
                            dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
                            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
                        })();
                    }
                }
            });
        }
    };
    function remove_underscore_parameters (url) {
        var cont = true;
        // TODO make sure Disqus ignores http/https differences
        // another / is appended in the loop
        var new_url = 'http:/';
        var parts = url.split ('/').slice (2);
        for(var i=0; i < parts.length; i++) {
            var part = parts[i];
            if (part[0] !== '_') {
                new_url += '/' + part;
            }
        }
        return new_url;
    }
    $.fn.gimmicks.methods = $.extend({}, $.fn.gimmicks.methods, methods);
}(jQuery));
