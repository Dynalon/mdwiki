(function($) {

    var alreadyDone = false;
    function disqus ($links, opt, text) {
        var default_options = {
            identifier: ''
        };
        var options = $.extend (default_options, opt);
        var disqus_div = $('<div id="disqus_thread" class="md-external md-external-noheight md-external-nowidth" >' + '<a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a></div>');
        disqus_div.css ('margin-top', '2em');
        return $links.each(function(i,link) {
            if (alreadyDone === true) {
                return;
            }
            alreadyDone = true;

            var $link = $(link);
            var disqus_shortname = $link.attr('href');

            if (disqus_shortname !== undefined && disqus_shortname.length > 0) {
                // insert the div
                $link.remove ();
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
                        var disqus_url = window.location.href;
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

    var disqusGimmick = new MDwiki.Core.Gimmick();
    disqusGimmick.addHandler('disqus', disqus);
    $.md.wiki.gimmicks.registerGimmick(disqusGimmick);
}(jQuery));
