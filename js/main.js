(function($) {
    'use strict';

    // modify internal links so we load them through our engine
    $.md.processPageLinks = function (domElement, baseUrl) {
        var html = $(domElement);
        if (baseUrl === undefined) {
            baseUrl = '';
        }
        // HACK against marked: empty links will have empy href attribute
        // we remove the href attribute from the a tag
        html.find('a').not('#md-menu a').filter(function () {
            var $this = $(this);
            var attr = $this.attr('href');
            if (!attr || attr.length === 0)
                $this.removeAttr('href');
        });

        html.find('a, img').each(function(i,e) {
            var link = $(e);
            // link must be jquery collection
            var isImage = false;
            var hrefAttribute = 'href';

            if (!link.attr(hrefAttribute)) {
                isImage = true;
                hrefAttribute = 'src';
            }
            var href = link.attr(hrefAttribute);

            if (href && href.lastIndexOf ('#!') >= 0)
                return;

            if (!isImage && href.startsWith ('#') && !href.startsWith('#!')) {
                // in-page link
                link.click(function(ev) {
                    ev.preventDefault();
                    $.md.scrollToInPageAnchor (href);
                });
            }

            if (! $.md.util.isRelativeUrl(href))
                return;

            if (isImage && ! $.md.util.isRelativePath(href))
                return;

            if (!isImage && $.md.util.isGimmickLink(link))
                return;

            function build_link (url) {
                if ($.md.util.hasMarkdownFileExtension (url))
                    return '#!' + url;
                else
                    return url;
            }

            var newHref = baseUrl + href;
            if (isImage)
                link.attr(hrefAttribute, newHref);
            else if ($.md.util.isRelativePath (href))
                link.attr(hrefAttribute, build_link(newHref));
            else
                link.attr(hrefAttribute, build_link(href));
        });
    };




    function extractHashData() {
        // first char is the # or #!
        var href;
        if (window.location.hash.startsWith('#!')) {
            href = window.location.hash.substring(2);
        } else {
            href = window.location.hash.substring(1);
        }
        href = decodeURIComponent(href);

        // extract possible in-page anchor
        var ex_pos = href.indexOf('#');
        if (ex_pos !== -1) {
            $.md.inPageAnchor = href.substring(ex_pos + 1);
            $.md.mainHref = href.substring(0, ex_pos);
        } else {
            $.md.mainHref = href;
        }
    }

    function appendDefaultFilenameToHash () {
        var newHashString = '';
        var currentHashString = window.location.hash || '';
        if (currentHashString === '' ||
            currentHashString === '#'||
            currentHashString === '#!')
        {
            newHashString = '#!index.md';
        }
        else if (currentHashString.startsWith ('#!') &&
                 currentHashString.endsWith('/')
                ) {
            newHashString = currentHashString + 'index.md';
        }
        if (newHashString)
            window.location.hash = newHashString;
    }

    $.initMDwiki();

    $(document).ready(function () {

        // stage init stuff

        extractHashData();

        appendDefaultFilenameToHash();

        $(window).bind('hashchange', function () {
            window.location.reload(false);
        });

        $.md.wiki.run();
    });
}(jQuery));
