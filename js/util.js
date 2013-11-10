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
            if (domAnchor.text().indexOf ('gimmick:') !== -1) {
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
                if (value.endsWith (ext)) {
                    result = true;
                    // break
                    return true;
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

    // adds a :icontains selector to jQuery that is case insensitive
    $.expr[':'].icontains = $.expr.createPseudo(function(arg) {
        return function(elem) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

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
