(function($) {
	var methods = {
		twitterfollow: function () {
			var $this = $(this);
			if ($this.length === 0)	{
				$this = $('a:icontains(gimmick:TwitterFollow)');
			}
			return $this.each(function() {
				var $this = $(this);
				var user;
				var href = $this.attr('href');

				if (href.indexOf ('twitter.com') <= 0) {
					user = $this.attr('href');
					href = 'https://twitter.com/' + user;
				}
				else {
					console.log('TODO: auto create twitter button from link');
					return;
				}
				// remove the leading @ if given
				if (user[0] === '@') {
					user = user.substring(1);
				}
				var twitter_src = $('<a href="' + href + '" class="twitter-follow-button" data-show-count="false" data-lang="en" data-show-screen-name="false">"'+ '@' + user + '</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>');
				$this.replaceWith (twitter_src);
			});
		}
    };
    $.fn.gimmicks.methods = $.extend ({}, $.fn.gimmicks.methods, methods);
}(jQuery));
