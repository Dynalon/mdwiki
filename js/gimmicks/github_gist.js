(function($) {
    var methods = {
        gist: function() {
            var $this = $(this);

            // TODO this is ugly, but document.write is useless at this point anyways
            // overload document.write()
            return $this.each(function() {
				var $this = $(this);
				var href = $this.attr('href');
				var re = new RegExp ('\\D*[0-9]+\\D*');
				var gist_id = href.match (re);
				if (gist_id !== null) {
					var gist_js_url  =	'https://gist.github.com/' + gist_id + '.js';
					var gist_script  ='<script src="' + gist_js_url + '"> </script>';
					// to bad, github gist script will use document.write which will at this point not do anything, because
					// the DOM got already loaded
					// so this gimmick is useless right now...

					// alternative: create an iframe, but then we have to adjust the frame height from within the main page
				}
			});
		}
    };
    $.fn.gimmicks.methods = $.extend ({}, $.fn.gimmicks.methods, methods);
}(jQuery));
