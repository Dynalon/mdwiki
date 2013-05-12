(function($) {
	var fb_script_loaded = false;
	var methods = {
		facebooklike: function (opt) {
			var $this = $(this);

			// first, load the javascript SDK if required
			if (fb_script_loaded === false) {
				fb_script_loaded = true;
				var fb_script = $('<div id="fb-root"></div><script>(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = "//connect.facebook.net/de_DE/all.js#xfbml=1"; fjs.parentNode.insertBefore(js, fjs);}(document, "script", "facebook-jssdk"));</script>');
				$('body').append(fb_script);
			}
			var default_options = {
				layout: 'standard',
				showfaces: true
			};
			var options = $.extend ({}, default_options, opt);
			// Due to a bug, we can have underscores _ in a markdown link
			// so we insert the underscores needed by facebook here
			if (options.layout === 'boxcount') {
				options.layout = 'box_count';
			}
			if (options.layout === 'buttoncount') {
				options.layout = 'button_count';
			}

			//$facebook_links = $("a[href*=gimmick\\:http\\:\\/\\/www\\.facebook\\.com]");
			//$facebook_links = $("a:contains(gimmick:FacebookLike)");
			if ($this.length === 0)	{
				$this = $('a:icontains(gimmick:FacebookLike)');
			}
			return $this.each(function() {
				var $this = $(this);
				var href = $this.attr('href');
				/*if (href.indexOf ("facebook.com") <= 0) {
					href = "//www.facebook.com/plugins/like.php?href=" + encodeURIComponent ($this.attr('href'));
				}
				var fb_frame = $('<iframe src="' + href + '" scrolling="no" frameborder="0" allowTransparency="true" style="border:none; overflow:hidden;"></iframe>');
				$this.replaceWith (fb_frame); */
				var $fb_div = $('<div class="fb-like" data-send="false" data-width="450"></div>');
				$fb_div.attr ('data-href', href);
				$fb_div.attr ('data-layout', options.layout);
				$fb_div.attr ('data-show-faces', options.showfaces);
				$this.replaceWith ($fb_div);
			});
		}
    };
    $.fn.gimmicks.methods = $.extend ({}, $.fn.gimmicks.methods, methods);
}(jQuery));
