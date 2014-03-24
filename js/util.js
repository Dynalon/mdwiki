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
        isRelativePath: function(path) {
            if (path === undefined)
                return false;
            if (path.startsWith('/'))
                return false;
            return true;
        },
        isGimmickLink: function(domAnchor) {
            if (domAnchor.toptext().indexOf ('gimmick:') !== -1) {
                return true;
            } else {
                return false;
            }
        },
        hasMarkdownFileExtension: function (str) {
            if (!str) return false;
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

    // turns hostname/path links into http://hostname/path links
    // we need to do this because if accessed by file:///, we need a different
    // transport scheme for external resources (like http://)
    $.md.prepareLink = function(link, options) {
        options = options || {};
        var ownProtocol = window.location.protocol;

        if (options.forceSSL)
            return 'https://' + link;
        if (options.forceHTTP)
            return 'http://' + link;

        if (ownProtocol === 'file:') {
            return 'http://' + link;
        }
        // default: use the same as origin resource
        return '//' + link;
    };

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

    $.md.util.repeatUntil = function (interval, predicate, maxRepeats) {
        maxRepeats = maxRepeats || 10;
        var dfd = $.Deferred();
        function recursive_repeat (interval, predicate, maxRepeats) {
            if (maxRepeats === 0) {
                dfd.reject();
                return;
            }
            if (predicate()) {
                dfd.resolve();
                return;
            } else {
                $.md.util.wait(interval).always(function () {
                    recursive_repeat(interval, predicate, maxRepeats - 1);
                });
            }
        }
        recursive_repeat(interval, predicate, maxRepeats);
        return dfd;
    };

    // a count-down latch as in Java7.
    $.md.util.countDownLatch = function (capacity, min) {
        min = min || 0;
        capacity = (capacity === undefined)? 1 : capacity ;
        var dfd = $.Deferred();
        if (capacity <= min) dfd.resolve();
        dfd.capacity = capacity;
        dfd.countDown = function () {
            dfd.capacity--;
            if (dfd.capacity <= min){
                dfd.resolve();
            }
        };
        return dfd;
    };

}(jQuery));
