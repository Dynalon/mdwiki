(function($) {
    'use strict';

    function resetStages() {
        var old_stages = $.md.stages;
        $.md.stages = [];
        $(old_stages).each(function(i,e) {
            $.md.stages.push($.Stage(e.name));
        });
    }


    function transformMarkdown (markdown) {
        var options = {
            gfm: true,
            tables: true,
            breaks: true
        };
        if ($.md.config.lineBreaks === 'original')
            options.breaks = false;
        else if ($.md.config.lineBreaks === 'gfm')
            options.breaks = true;

        marked.setOptions(options);

        // get sample markdown
        var uglyHtml = marked(markdown);
        return uglyHtml;
    }

    function registerFetchMarkdown() {

        var md = '';

        $.md.stage('init').subscribe(function(done) {
            var ajaxReq = {
                url: $.md.mainHref,
                dataType: 'text'
            };
            $.ajax(ajaxReq).done(function(data) {
                // TODO do this elsewhere
                md = data;
                done();
            }).fail(function() {
                var log = $.md.getLogger();
                log.fatal('Could not get ' + $.md.mainHref);
                done();
            });
        });

        // find baseUrl
        $.md.stage('transform').subscribe(function(done) {
            var len = $.md.mainHref.lastIndexOf('/');
            var baseUrl = $.md.mainHref.substring(0, len+1);
            $.md.baseUrl = baseUrl;
            done();
        });

        $.md.stage('transform').subscribe(function(done) {
            var uglyHtml = transformMarkdown(md);
            $('#md-content').html(uglyHtml);
            md = '';
            var dfd = $.Deferred();
            loadExternalIncludes(dfd);
            dfd.always(function () {
                done();
            });
        });
    }

    // load [include](/foo/bar.md) external links
    function loadExternalIncludes(parent_dfd) {

        function findExternalIncludes () {
            return $('a').filter (function () {
                var href = $(this).attr('href');
                var text = $(this).toptext();
                var isMarkdown = $.md.util.hasMarkdownFileExtension(href);
                var isInclude = text === 'include';
                var isPreview = text.startsWith('preview:');
                return (isInclude || isPreview) && isMarkdown;
            });
        }

        function selectPreviewElements ($jqcol, num_elements) {
            function isTextNode(node) {
                return node.nodeType === 3;
            }
            var count = 0;
            var elements = [];
            $jqcol.each(function (i,e) {
                if (count < num_elements) {
                    elements.push(e);
                    if (!isTextNode(e)) count++;
                }
            });
            return $(elements);
        }

        var external_links = findExternalIncludes ();
        // continue execution when all external resources are fully loaded
        var latch = $.md.util.countDownLatch (external_links.length);
        latch.always (function () {
            parent_dfd.resolve();
        });

        external_links.each(function (i,e) {
            var $el = $(e);
            var href = $el.attr('href');
            var text = $el.toptext();

            $.ajax({
                url: href,
                dataType: 'text'
            })
            .done(function (data) {
                var $html = $(transformMarkdown(data));
                if (text.startsWith('preview:')) {
                    // only insert the selected number of paragraphs; default 3
                    var num_preview_elements = parseInt(text.substring(8), 10) ||3;
                    var $preview = selectPreviewElements ($html, num_preview_elements);
                    $preview.last().append('<a href="' + href +'"> ...read more &#10140;</a>');
                    $preview.insertBefore($el.parent('p').eq(0));
                    $el.remove();
                } else {
                    $html.insertAfter($el.parents('p'));
                    $el.remove();
                }
            }).always(function () {
                latch.countDown();
            });
        });
    }

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

    function registerClearContent() {

        $.md.stage('init').subscribe(function(done) {
            $('#md-all').empty();
            var skel ='<div id="md-body"><div id="md-title"></div><div id="md-menu">'+
                '</div><div id="md-content"></div></div>';
            $('#md-all').prepend($(skel));
            done();
        });

    }
    function loadContent(href) {
        $.md.mainHref = href;

        registerFetchMarkdown();
        registerClearContent();

        // find out which link gimmicks we need
        $.md.stage('ready').subscribe(function(done) {
            $.md.initializeGimmicks();
            $.md.registerLinkGimmicks();
            done();
        });

        // wire up the load method of the modules
        $.each($.md.gimmicks, function(i, module) {
            if (module.load === undefined) {
                return;
            }
            $.md.stage('load').subscribe(function(done) {
                module.load();
                done();
            });
        });

        $.md.stage('ready').subscribe(function(done) {
            $.md('createBasicSkeleton');
            done();
        });

        $.md.stage('bootstrap').subscribe(function(done){
            $.mdbootstrap('bootstrapify');
            $.md.processPageLinks($('#md-content'), $.md.baseUrl);
            done();
        });
    }

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

    $(document).ready(function () {

        // stage init stuff
        $.initMDwiki();
        var log = $.md.getLogger();

        extractHashData();

        appendDefaultFilenameToHash();

        $(window).bind('hashchange', function () {
            window.location.reload(false);
        });

        loadContent($.md.mainHref);
        $.md.wiki.run();
    });
}(jQuery));
