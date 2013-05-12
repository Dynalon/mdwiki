(function($) {
    var methods = {
        // takes a standard <img> tag and adds a hyperlink to the image source
        // needed since we scale down images via css and want them to be accessible
        // in original format
        alerts: function() {

            var select_paragraphs = function (expressions) {
                var $exp = $([ "achtung", "attention", "warnung", "warning", "atención", "guarda", "advertimiento" ]);
                var matched_p = new Array ();
                $("p").filter (function () {
                    $par = $(this);
                    // check against each expression
                    $exp.each (function (i,trigger) {
                        var txt = $par.text().toLowerCase ();
                        // we match only paragrachps in which the 'trigger' expression
                        // is follow by a ! or :
                        var re = new RegExp (trigger + "(:|!)+.*","i");
                        if (txt.match (re) !== null)
                        	matched_p.push ($par);
                    });
                });
                return matched_p;
            };

            if (!(this instanceof jQuery)) {
                // return those paragraphes
                var $par = $(select_paragraphs ()); 
            } else {
                var $par = $(this);
            } 
            return $par.each(function() {
                $this = $(this);
                $this.addClass ("alert");
            });
        }
    };
    $.gimmicks.methods = $.extend({}, $.fn.gimmicks.methods, methods);
}(jQuery));