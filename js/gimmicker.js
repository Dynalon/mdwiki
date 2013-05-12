(function($) {
    $.gimmicks = $.fn.gimmicks = function(method) {
        if (method === undefined) {
            autogimmicks ();
            return;
        }
        // call the gimmick 
        if ($.fn.gimmicks.methods[method]) {
            return $.fn.gimmicks.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error('Gimmick ' + method + ' does not exist on jQuery.gimmicks');
        }
    };

    // TODO underscores _ in Markdown links are not allowed! bug in our MD imlemenation
    
    // activate all gimmicks on a page, that are contain the text gimmick:
    function autogimmicks () {
        var $gimmicks = $("a:icontains(gimmick:)");
        $gimmicks.each(function() {
            $this = $(this);
            var link_text = $.trim ($this.text());

            // check whether this is a gimmick link in general
            if (link_text.match(/gimmick:/i) !== null) {
                //var r = new RegExp (/gimmick:([^(]*)\((.*)\)/i);
                // this regex is buggy, the match[3] ends with } so it shouldn't
                var r = new RegExp(/gimmick:\s*([^(\s]*)\s*(\(\s*{?(.*)\s*}?\s*\))*/i);
                var matches = r.exec(link_text);
                if (matches === null || matches[1] === undefined) {
                    $.error("Error matching a gimmick: " + link_text);
                    return;
                }
                var method = matches[1].toLowerCase();
                var args = null;
                // getting the parameters
                if (matches[3] !== undefined) {
                    // remove whitespaces
                    params = $.trim (new String(matches[3]));
                    // remove the closing } if present
                    if (params.charAt (params.length - 1) === "}") {
                        params = params.substring(0, params.length - 1);
                    }
                    // add surrounding braces and paranthese
                    params = "({" + params + "})";
                    // replace any single quotes by double quotes
                    params = params.replace(/'/g, '"');
                    // finally, try if the json object is valid
                    try {
                        args = eval(params);
                    } catch (err) {
                        $.error("error parsing argument of gimmick: " + link_text + "giving error: " + err);
                    }
                }
                // call the gimmick 
                if ($.fn.gimmicks.methods[method]) {
                    return $.fn.gimmicks.methods[method].apply(this, [args]);
                } else {
                    $.error('Gimmick ' + method + ' does not exist on jquery.gimmicks');
                }
            }
        });
    }
}(jQuery));
