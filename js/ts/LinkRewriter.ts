///<reference path="../../typings/tsd.d.ts" />

module MDwiki.Links {
    export class LinkRewriter {

        private domElement:JQuery;

        constructor(domElement:any) {
            this.domElement = $(domElement);
        }

        // TODO transform into instance members instead of static
        // modify internal links so we load them through our engine
        static processPageLinks(domElement?: any, baseUrl?: any) {
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

            html.find('a, img').each(function (i, e) {
                var link = $(e);
                // link must be jquery collection
                var isImage = false;
                var hrefAttribute = 'href';

                if (!link.attr(hrefAttribute)) {
                    isImage = true;
                    hrefAttribute = 'src';
                }
                var href = link.attr(hrefAttribute);

                if (href && href.lastIndexOf('#!') >= 0)
                    return;

                if (!isImage && href.startsWith('#') && !href.startsWith('#!')) {
                    // in-page link
                    link.click(function (ev) {
                        ev.preventDefault();
                        console.log("inpage anchors not yet implemented");
                    });
                }

                if (!MDwiki.Utils.Url.isRelativeUrl(href))
                    return;

                if (isImage && !MDwiki.Utils.Url.isRelativePath(href))
                    return;

                if (!isImage && MDwiki.Utils.Url.isGimmickLink(link))
                    return;

                function build_link(url) {
                    if (MDwiki.Utils.Url.hasMarkdownFileExtension(url))
                        return '#!' + url;
                    else
                        return url;
                }

                var newHref = baseUrl + href;
                if (isImage)
                    link.attr(hrefAttribute, newHref);
                else if (MDwiki.Utils.Url.isRelativePath(href))
                    link.attr(hrefAttribute, build_link(newHref));
                else
                    link.attr(hrefAttribute, build_link(href));
            });
        }
    }
}
