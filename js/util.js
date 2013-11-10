(function($) {
    var publicMethods = {
        isRelativeUrl: function(url) {
            if (url === undefined) {
                return false;
            }
            // if there is :// in it, its considered absolute
            // else its relative
            if (url.indexOf('://') === -1) {
                return true;
            } else {
                return false;
            }
        },
        isGimmickLink: function(domAnchor) {
            if (domAnchor.toptext().indexOf ('gimmick:') !== -1) {
                return true;
            } else {
                return false;
            }
        },
        hasMarkdownFileExtension: function (str) {
            var markdownExtensions = [ '.md', '.markdown', '.mdown' ];
            var result = false;
            var value = str.toLowerCase().split('#')[0];
            $(markdownExtensions).each(function (i,ext) {
                if (value.toLowerCase().endsWith (ext)) {
                    result = true;
                }
            });
            return result;
        },
        wait: function(time) {
            return $.Deferred(function(dfd) {
                setTimeout(dfd.resolve, time);
            });
        }
    };
    $.md.util = $.extend ({}, $.md.util, publicMethods);

    if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function(str) {
            return this.slice(0, str.length) === str;
        };
    }
    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function(str) {
            return this.slice(this.length - str.length, this.length) === str;
        };
    }

    $.fn.extend ({
        toptext: function () {
            return this.clone().children().remove().end().text();
        }
    });

    // adds a :icontains selector to jQuery that is case insensitive
    $.expr[':'].icontains = $.expr.createPseudo(function(arg) {
        return function(elem) {
            return $(elem).toptext().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

    $.md.util.getInpageAnchorText = function (text) {
        var subhash = text.replace(/ /g, '_');
        // TODO remove more unwanted characters like ?/,- etc.
        return subhash;

    };
    $.md.util.getInpageAnchorHref = function (text, href) {
        href = href || $.md.mainHref;
        var subhash = $.md.util.getInpageAnchorText(text);
        return '#!' + href + '#' + subhash;
    };

    // a count-down latch as in Java7.
    $.md.util.countDownLatch = function (capacity, min) {
        min = min || 0;
        var dfd = $.Deferred();
        if (capacity <= min) dfd.resolve();
        dfd.capacity = capacity;
        dfd.countDown = function () {
            dfd.capacity--;
            if (dfd.capacity <= min)
                dfd.resolve();
        };
        return dfd;
    };

}(jQuery));
