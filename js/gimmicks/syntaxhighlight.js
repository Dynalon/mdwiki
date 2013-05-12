(function($) {
    var methods = {
	  	syntaxhighlight: function (opt) {
	  		console.dir ($this);
	  		$this = $(this);
	  		console.dir ($this);
	  // 		var $code_sections;
			// console.log ("1here");
			// $code_sections = $("pre code");

   //          return $code_sections.each(function(index, element) {
			// 	hljs.highlightBlock(element);
			// });
		}
    };
    $.fn.gimmicks.methods = $.extend ({}, $.fn.gimmicks.methods, methods);
}(jQuery));